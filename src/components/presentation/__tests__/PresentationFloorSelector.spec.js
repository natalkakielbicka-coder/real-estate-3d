import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import PresentationFloorSelector from '../PresentationFloorSelector.vue'

enableAutoUnmount(afterEach)

describe('PresentationFloorSelector', () => {
  it('exposes only the selected floor as pressed', async () => {
    const wrapper = mount(PresentationFloorSelector)
    const buttons = wrapper.findAll('.floor-selector__item')
    const groundFloor = wrapper.get('[aria-label^="Parter:"]')
    const firstFloor = wrapper.get('[aria-label^="Piętro 1:"]')
    const pressedButtons = () =>
      buttons.filter((button) => button.attributes('aria-pressed') === 'true')

    expect(buttons.every((button) => button.attributes('aria-pressed') === 'false')).toBe(true)

    await wrapper.setProps({ selectedFloor: { floorNumber: 0 } })

    expect(pressedButtons()).toHaveLength(1)
    expect(groundFloor.attributes('aria-pressed')).toBe('true')

    await wrapper.setProps({ selectedFloor: { floorNumber: 1 } })

    expect(pressedButtons()).toHaveLength(1)
    expect(firstFloor.attributes('aria-pressed')).toBe('true')
    expect(groundFloor.attributes('aria-pressed')).toBe('false')

    await wrapper.setProps({ selectedFloor: null })

    expect(buttons.every((button) => button.attributes('aria-pressed') === 'false')).toBe(true)
  })

  it('emits zero when selecting the ground floor', async () => {
    const wrapper = mount(PresentationFloorSelector)
    const groundFloor = wrapper.get('[aria-label^="Parter:"]')

    await groundFloor.trigger('click')

    expect(wrapper.emitted('select-floor')).toEqual([[0]])
  })
})
