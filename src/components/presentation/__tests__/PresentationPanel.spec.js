import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import PresentationPanel from '../PresentationPanel.vue'

describe('PresentationPanel availability progress', () => {
  const createFloor = (available, total) => ({
    buildingId: 'building-a',
    buildingName: 'Budynek A',
    floorNumber: 1,
    availableApartments: available,
    apartmentCount: total,
    apartments: [],
  })

  const mountPanel = (available, total) => {
    return shallowMount(PresentationPanel, {
      props: {
        selectedFloor: createFloor(available, total),
        selectedApartment: null,
      },
    })
  }

  const getProgressWidth = (wrapper) => {
    const progress = wrapper.find('.floor-panel__availability-progress')

    expect(progress.exists()).toBe(true)

    return progress.element.style.width
  }

  it('shows 60% when 6 of 10 apartments are available', () => {
    const wrapper = mountPanel(6, 10)

    expect(getProgressWidth(wrapper)).toBe('60%')

    wrapper.unmount()
  })

  it('shows 100% when all apartments are available', () => {
    const wrapper = mountPanel(10, 10)

    expect(getProgressWidth(wrapper)).toBe('100%')

    wrapper.unmount()
  })

  it('shows 0% when no apartments are available', () => {
    const wrapper = mountPanel(0, 10)

    expect(getProgressWidth(wrapper)).toBe('0%')

    wrapper.unmount()
  })

  it('shows 0% when the floor has no apartments', () => {
    const wrapper = mountPanel(0, 0)

    expect(getProgressWidth(wrapper)).toBe('0%')

    wrapper.unmount()
  })

  it('caps progress at 100% when available count exceeds total', () => {
    const wrapper = mountPanel(12, 10)

    expect(getProgressWidth(wrapper)).toBe('100%')

    wrapper.unmount()
  })

  it('prevents negative progress percentages', () => {
    const wrapper = mountPanel(-2, 10)

    expect(getProgressWidth(wrapper)).toBe('0%')

    wrapper.unmount()
  })

  it('handles invalid apartment counts', () => {
    const wrapper = mountPanel(5, NaN)

    expect(getProgressWidth(wrapper)).toBe('0%')

    wrapper.unmount()
  })

  it('handles invalid available apartment counts', () => {
    const wrapper = mountPanel(NaN, 10)

    expect(getProgressWidth(wrapper)).toBe('0%')

    wrapper.unmount()
  })

  it('updates progress when selected floor changes', async () => {
    const wrapper = mountPanel(6, 10)

    expect(getProgressWidth(wrapper)).toBe('60%')

    await wrapper.setProps({
      selectedFloor: createFloor(2, 10),
    })

    expect(getProgressWidth(wrapper)).toBe('20%')

    wrapper.unmount()
  })
})
