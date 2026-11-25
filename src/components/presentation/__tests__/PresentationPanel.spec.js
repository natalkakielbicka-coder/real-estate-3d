import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, flushPromises, shallowMount } from '@vue/test-utils'
import PresentationPanel from '../PresentationPanel.vue'

enableAutoUnmount(afterEach)

describe('PresentationPanel', () => {
  const createFloor = (statuses) => ({
    buildingId: 'building-a',
    buildingName: 'Budynek A',
    floorNumber: 1,
    apartments: statuses.map((status, index) => ({
      id: index + 1,
      status,
      rooms: 2,
      area: 50,
      price: 400_000,
    })),
  })

  const mountPanel = (selectedFloor) =>
    shallowMount(PresentationPanel, {
      props: { selectedFloor, selectedApartment: null },
    })

  const getProgressWidth = (wrapper) =>
    wrapper.get('.floor-panel__availability-progress').element.style.width

  const getDetailValue = (wrapper, label) => {
    const detail = wrapper
      .findAll('.floor-panel__detail')
      .find((row) => row.get('span').text() === label)

    return detail?.get('strong').text()
  }

  it.each([
    ['60%', ['available', 'available', 'available', 'reserved', 'sold']],
    ['100%', ['available', 'available']],
    ['0%', ['reserved', 'sold']],
  ])('shows %s progress based on apartment statuses', (width, statuses) => {
    const wrapper = mountPanel(createFloor(statuses))

    expect(getProgressWidth(wrapper)).toBe(width)
  })

  it('shows zero availability on an empty floor', () => {
    const wrapper = mountPanel(createFloor([]))

    expect(wrapper.get('.floor-panel__availability-header strong').text()).toBe('0 z 0')
    expect(getProgressWidth(wrapper)).toBe('0%')
  })

  it('uses apartment data for all availability figures when floor counts are stale', () => {
    const wrapper = mountPanel({
      ...createFloor(['available', 'available', 'reserved', 'sold']),
      availableApartments: 1,
      apartmentCount: 10,
    })

    expect(wrapper.get('.floor-panel__availability-header strong').text()).toBe('2 z 4')
    expect(getDetailValue(wrapper, 'Mieszkania')).toBe('4')
    expect(getDetailValue(wrapper, 'Dostępne mieszkania')).toBe('2 z 4')
    expect(getProgressWidth(wrapper)).toBe('50%')
  })

  it('keeps the apartment list total based on the floor when filtering', async () => {
    const floor = createFloor(['available', 'available', 'reserved', 'sold'])
    floor.apartments[0].balcony = true
    floor.apartments[2].balcony = true

    const wrapper = mountPanel({ ...floor, apartmentCount: 10 })
    const count = wrapper.get('.floor-panel__apartments-count')
    const balconyFilter = wrapper
      .findAll('.floor-panel__checkbox')
      .find((label) => label.text() === 'Tylko mieszkania z balkonem')
      .get('input')

    expect(count.text()).toBe('4 z 4')

    await balconyFilter.setValue(true)
    expect(count.text()).toBe('2 z 4')

    await balconyFilter.setValue(false)
    expect(count.text()).toBe('4 z 4')
  })

  it('updates progress when selected floor changes', async () => {
    const wrapper = mountPanel(
      createFloor(['available', 'available', 'available', 'reserved', 'sold']),
    )

    expect(getProgressWidth(wrapper)).toBe('60%')

    await wrapper.setProps({
      selectedFloor: createFloor(['available', 'reserved', 'reserved', 'sold', 'sold']),
    })

    expect(getProgressWidth(wrapper)).toBe('20%')
  })

  it('shows the latest result when retrying apartment link copy', async () => {
    const writeText = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('Clipboard access denied'))
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    try {
      const selectedFloor = createFloor(['available'])
      const wrapper = shallowMount(PresentationPanel, {
        props: { selectedFloor, selectedApartment: selectedFloor.apartments[0] },
      })
      const copyButton = wrapper.get('.apartment-details__share')

      await copyButton.trigger('click')
      await flushPromises()
      expect(copyButton.text()).toBe('Skopiowano link ✓')

      await copyButton.trigger('click')
      await flushPromises()
      expect(copyButton.text()).toBe('Nie udało się skopiować')
      expect(writeText).toHaveBeenCalledTimes(2)
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('ignores a second copy click while the first clipboard write is pending', async () => {
    const { promise, resolve } = Promise.withResolvers()
    const writeText = vi.fn().mockReturnValue(promise)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    try {
      const selectedFloor = createFloor(['available'])
      const wrapper = shallowMount(PresentationPanel, {
        props: { selectedFloor, selectedApartment: selectedFloor.apartments[0] },
      })
      const copyButton = wrapper.get('.apartment-details__share')

      await copyButton.trigger('click')

      expect(copyButton.element.disabled).toBe(true)

      await copyButton.trigger('click')

      expect(writeText).toHaveBeenCalledTimes(1)

      resolve()
      await flushPromises()

      expect(copyButton.element.disabled).toBe(false)
      expect(copyButton.text()).toBe('Skopiowano link ✓')
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it.each(['denied', 'unavailable'])(
    'shows a selectable apartment link when clipboard access is %s',
    async (clipboardAccess) => {
      const writeText = vi.fn().mockRejectedValue(new Error('Clipboard access denied'))
      const clipboard = clipboardAccess === 'denied' ? { writeText } : undefined
      vi.stubGlobal('navigator', { clipboard })

      try {
        const selectedFloor = createFloor(['available'])
        const wrapper = shallowMount(PresentationPanel, {
          props: { selectedFloor, selectedApartment: selectedFloor.apartments[0] },
        })
        const fallback = '.apartment-details__share-fallback input'

        expect(wrapper.find(fallback).exists()).toBe(false)

        await wrapper.get('.apartment-details__share').trigger('click')
        await flushPromises()

        const input = wrapper.get(fallback)
        expect(input.element.readOnly).toBe(true)
        expect(input.element.value).toBe(window.location.href)

        await input.trigger('focus')

        expect(input.element.selectionStart).toBe(0)
        expect(input.element.selectionEnd).toBe(input.element.value.length)
      } finally {
        vi.unstubAllGlobals()
      }
    },
  )

  it('ignores a clipboard failure after switching apartments', async () => {
    const { promise, reject } = Promise.withResolvers()
    const writeText = vi.fn().mockReturnValue(promise)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    try {
      const selectedFloor = createFloor(['available', 'available'])
      const [firstApartment, secondApartment] = selectedFloor.apartments
      const wrapper = shallowMount(PresentationPanel, {
        props: { selectedFloor, selectedApartment: firstApartment },
      })
      const copyButton = '.apartment-details__share'

      await wrapper.get(copyButton).trigger('click')
      expect(writeText).toHaveBeenCalledOnce()
      expect(wrapper.get(copyButton).element.disabled).toBe(true)

      await wrapper.setProps({ selectedApartment: secondApartment })

      reject(new Error('Clipboard access denied'))
      await flushPromises()

      expect(wrapper.get(copyButton).element.disabled).toBe(false)
      expect(wrapper.get(copyButton).text()).toBe('Kopiuj link do mieszkania')
      expect(wrapper.find('.apartment-details__share-fallback').exists()).toBe(false)
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('validates the maximum price before the filter delay elapses', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mountPanel(createFloor(['available']))
      const input = wrapper.get('#max-price')

      await input.setValue('-1')

      expect(input.attributes('aria-invalid')).toBe('true')
      expect(input.attributes('aria-describedby')).toBe('max-price-error')
      expect(wrapper.get('#max-price-error').text()).toBe(
        'Podaj poprawną cenę, nie mniejszą niż 0.',
      )

      await input.setValue('450000')

      expect(input.attributes('aria-invalid')).toBe('false')
      expect(input.attributes('aria-describedby')).toBeUndefined()
      expect(wrapper.find('#max-price-error').exists()).toBe(false)
    } finally {
      vi.clearAllTimers()
      vi.useRealTimers()
    }
  })

  it('applies the maximum price immediately when Enter is pressed', async () => {
    vi.useFakeTimers()

    try {
      const floor = createFloor(['available', 'available'])
      floor.apartments[0].number = 'A-1'
      floor.apartments[1].number = 'A-2'
      floor.apartments[1].price = 500_000

      const wrapper = mountPanel(floor)
      const input = wrapper.get('#max-price')
      const count = wrapper.get('.floor-panel__apartments-count')

      await input.setValue('450000')
      expect(count.text()).toBe('2 z 2')

      await input.trigger('keydown', { key: 'Enter' })

      expect(count.text()).toBe('1 z 2')
      expect(wrapper.findAll('.apartment-row')).toHaveLength(1)
      expect(wrapper.get('.apartment-row').text()).toContain('A-1')
    } finally {
      vi.clearAllTimers()
      vi.useRealTimers()
    }
  })

  it('applies only the latest maximum price after the typing delay', async () => {
    vi.useFakeTimers()

    try {
      const floor = createFloor(['available', 'available'])
      floor.apartments[1].price = 500_000
      const wrapper = mountPanel(floor)
      const input = wrapper.get('#max-price')
      const count = wrapper.get('.floor-panel__apartments-count')

      await input.setValue('350000')
      await vi.advanceTimersByTimeAsync(300)
      await input.setValue('450000')

      await vi.advanceTimersByTimeAsync(300)
      expect(count.text()).toBe('2 z 2')

      await vi.advanceTimersByTimeAsync(299)
      expect(count.text()).toBe('2 z 2')

      await vi.advanceTimersByTimeAsync(1)
      expect(count.text()).toBe('1 z 2')
    } finally {
      vi.clearAllTimers()
      vi.useRealTimers()
    }
  })
})
