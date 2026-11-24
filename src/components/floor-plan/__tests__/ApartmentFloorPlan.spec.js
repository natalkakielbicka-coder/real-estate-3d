import { afterEach, describe, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { h } from 'vue'
import ApartmentFloorPlan from '../ApartmentFloorPlan.vue'

enableAutoUnmount(afterEach)

describe('ApartmentFloorPlan', () => {
  it('gives each rendered floor plan its own SVG mask', () => {
    const wrapper = mount({
      render: () =>
        h('div', [
          h(ApartmentFloorPlan, {
            apartment: { id: 'a', number: 'A-1', floorPlanType: 'studio' },
          }),
          h(ApartmentFloorPlan, {
            apartment: { id: 'b', number: 'B-1', floorPlanType: 'twoRooms' },
          }),
        ]),
    })

    const [first, second] = wrapper.findAllComponents(ApartmentFloorPlan)
    const firstId = first.get('mask').attributes('id')
    const secondId = second.get('mask').attributes('id')

    expect(firstId).toBeTruthy()
    expect(secondId).toBeTruthy()
    expect(firstId).not.toBe(secondId)
    expect(first.get('g[mask]').attributes('mask')).toBe(`url(#${firstId})`)
    expect(second.get('g[mask]').attributes('mask')).toBe(`url(#${secondId})`)
  })
})
