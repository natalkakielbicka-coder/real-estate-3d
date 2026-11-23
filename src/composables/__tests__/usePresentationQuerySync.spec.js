import { defineComponent, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { usePresentationQuerySync } from '../usePresentationQuerySync'

enableAutoUnmount(afterEach)

it('keeps unrelated query parameters when closing the floor panel', async () => {
  const apartment = { id: 'A-2-1', status: 'available' }
  const floor = { floorNumber: 2, apartments: [apartment] }
  const selectedFloor = ref(floor)
  const selectedApartment = ref(apartment)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })

  await router.push('/?floor=2&apartment=A-2-1&utm_source=test')

  const close = () => {
    selectedFloor.value = null
    selectedApartment.value = null
  }
  const harness = defineComponent({
    setup() {
      usePresentationQuerySync({
        threeScene: ref({ selectFloorByNumber: vi.fn() }),
        selectedFloor,
        selectedApartment,
        onClose: close,
        onApartmentSelect: vi.fn(),
        onApartmentBack: vi.fn(),
      })

      return () => null
    },
  })

  mount(harness, { global: { plugins: [router] } })
  close()

  await vi.waitFor(() => {
    expect(router.currentRoute.value.query).toEqual({ utm_source: 'test' })
  })
})

it('preserves unrelated query parameters when selecting a floor and apartment', async () => {
  const apartment = { id: 'A-2-1', status: 'available' }
  const floor = { floorNumber: 2, apartments: [apartment] }
  const selectedFloor = ref(null)
  const selectedApartment = ref(null)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })

  await router.push('/?utm_source=test')

  const harness = defineComponent({
    setup() {
      usePresentationQuerySync({
        threeScene: ref({ selectFloorByNumber: vi.fn() }),
        selectedFloor,
        selectedApartment,
        onClose: vi.fn(),
        onApartmentSelect: vi.fn(),
        onApartmentBack: vi.fn(),
      })

      return () => null
    },
  })

  mount(harness, { global: { plugins: [router] } })

  selectedFloor.value = floor

  await vi.waitFor(() => {
    expect(router.currentRoute.value.query).toEqual({ utm_source: 'test', floor: '2' })
  })

  selectedApartment.value = apartment

  await vi.waitFor(() => {
    expect(router.currentRoute.value.query).toEqual({
      utm_source: 'test',
      floor: '2',
      apartment: 'A-2-1',
    })
  })
})
