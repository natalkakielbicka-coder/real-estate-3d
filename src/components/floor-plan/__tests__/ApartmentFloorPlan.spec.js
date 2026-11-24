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

  it('includes the room area in the accessible label only when available', () => {
    const wrapper = mount(ApartmentFloorPlan, {
      props: {
        apartment: {
          id: 'a',
          number: 'A-1',
          floorPlanType: 'studio',
          roomDetails: [
            { id: 'kitchen', name: 'Kuchnia', area: 8.5 },
            { id: 'hall', name: 'Przedpokój' },
          ],
        },
      },
    })

    const labels = wrapper.findAll('.floor-plan__room').map((room) => room.attributes('aria-label'))

    expect(labels).toContain('Kuchnia, 8,50 m²')
    expect(labels).toContain('Przedpokój')
  })

  it.each(['Enter', ' '])('toggles room details with key %j', async (key) => {
    const wrapper = mount(ApartmentFloorPlan, {
      props: {
        apartment: {
          id: 'a',
          number: 'A-1',
          floorPlanType: 'studio',
          roomDetails: [{ id: 'kitchen', name: 'Kuchnia', area: 8.5 }],
        },
      },
    })

    const room = wrapper.get('[aria-label="Kuchnia, 8,50 m²"]')
    const details = '.floor-plan__details'

    expect(room.attributes('aria-pressed')).toBe('false')
    expect(wrapper.find(details).exists()).toBe(false)

    await room.trigger('keydown', { key })

    expect(room.attributes('aria-pressed')).toBe('true')
    expect(wrapper.get(details).text()).toContain('Kuchnia')

    await room.trigger('keydown', { key })

    expect(room.attributes('aria-pressed')).toBe('false')
    expect(wrapper.find(details).exists()).toBe(false)
  })

  it('clears the selected room when the apartment changes', async () => {
    const apartment = {
      id: 'a',
      number: 'A-1',
      floorPlanType: 'studio',
      roomDetails: [{ id: 'kitchen', name: 'Kuchnia', area: 8.5 }],
    }
    const wrapper = mount(ApartmentFloorPlan, { props: { apartment } })
    const kitchen = '[aria-label="Kuchnia, 8,50 m²"]'

    await wrapper.get(kitchen).trigger('click')

    expect(wrapper.get(kitchen).attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('.floor-plan__details').text()).toContain('Kuchnia')

    await wrapper.setProps({ apartment: { ...apartment, id: 'b', number: 'B-1' } })

    expect(wrapper.get(kitchen).attributes('aria-pressed')).toBe('false')
    expect(wrapper.find('.floor-plan__details').exists()).toBe(false)
  })
})
