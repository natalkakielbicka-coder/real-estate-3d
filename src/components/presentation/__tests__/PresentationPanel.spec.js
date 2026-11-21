import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, shallowMount } from '@vue/test-utils'
import PresentationPanel from '../PresentationPanel.vue'

enableAutoUnmount(afterEach)

describe('PresentationPanel availability progress', () => {
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
})
