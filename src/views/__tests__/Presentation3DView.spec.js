import { afterEach, describe, expect, it, vi } from 'vitest'
import { enableAutoUnmount, shallowMount } from '@vue/test-utils'
import ThreeScene from '../../components/three/ThreeScene.vue'
import Presentation3DView from '../Presentation3DView.vue'

vi.mock('@/composables/usePresentationQuerySync', () => ({
  usePresentationQuerySync: vi.fn(),
}))

enableAutoUnmount(afterEach)

const openFloorPlan = async () => {
  const wrapper = shallowMount(Presentation3DView, {
    attachTo: document.body,
    global: {
      stubs: {
        PresentationPanel: {
          emits: ['open-floor-plan'],
          template:
            '<button type="button" @click="$emit(\'open-floor-plan\')">Rzut mieszkania</button>',
        },
      },
    },
  })
  const apartment = { id: 'a', number: 'A-1', area: 48.5, floorPlanType: 'studio' }
  const scene = wrapper.getComponent(ThreeScene)

  scene.vm.$emit('floor-selected', { floorNumber: 1, apartments: [apartment] })
  scene.vm.$emit('apartment-selected', apartment)
  await wrapper.vm.$nextTick()

  const trigger = wrapper.get('button')
  trigger.element.focus()
  await trigger.trigger('click')

  return { wrapper, trigger }
}

describe('Presentation3DView floor plan dialog', () => {
  it('labels the dialog with the heading containing the apartment number', async () => {
    const { wrapper } = await openFloorPlan()
    const dialog = wrapper.get('[role="dialog"]')
    const heading = dialog.get('h2')
    const headingId = heading.attributes('id')

    expect(headingId).toBeTruthy()
    expect(dialog.attributes('aria-labelledby')).toBe(headingId)
    expect(heading.text()).toBe('Mieszkanie A-1')
  })

  it('moves focus to the close button when opening the floor plan', async () => {
    const { wrapper } = await openFloorPlan()
    const closeButton = wrapper.get('[aria-label="Zamknij rzut mieszkania"]')

    expect(document.activeElement).toBe(closeButton.element)
  })

  it('restores focus to the opener after closing the floor plan with Escape', async () => {
    const { wrapper, trigger } = await openFloorPlan()
    const closeButton = wrapper.get('[aria-label="Zamknij rzut mieszkania"]')

    await closeButton.trigger('keydown', { key: 'Escape' })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger.element)
  })
})
