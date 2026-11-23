import { defineComponent, ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, expect, it, vi } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { usePresentationQuerySync } from '../usePresentationQuerySync'

enableAutoUnmount(afterEach)

const mountQuerySync = (router, options) => {
  const Harness = defineComponent({
    setup() {
      usePresentationQuerySync(options)
      return () => null
    },
  })

  mount(Harness, { global: { plugins: [router] } })
}

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

  mountQuerySync(router, {
    threeScene: ref({ selectFloorByNumber: vi.fn() }),
    selectedFloor,
    selectedApartment,
    onClose: close,
    onApartmentSelect: vi.fn(),
    onApartmentBack: vi.fn(),
  })

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

  mountQuerySync(router, {
    threeScene: ref({ selectFloorByNumber: vi.fn() }),
    selectedFloor,
    selectedApartment,
    onClose: vi.fn(),
    onApartmentSelect: vi.fn(),
    onApartmentBack: vi.fn(),
  })

  selectedFloor.value = floor

  await vi.waitFor(() => {
    expect(router.currentRoute.value.query).toEqual({
      utm_source: 'test',
      floor: '2',
    })
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

it.each(['missing', 'A-2-sold'])('keeps the floor for invalid apartment link %s', async (id) => {
  const floor = {
    floorNumber: 2,
    apartments: [{ id: 'A-2-sold', status: 'sold' }],
  }
  const selectedFloor = ref(null)
  const selectedApartment = ref(null)
  const onApartmentSelect = vi.fn()
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })

  await router.push({
    path: '/',
    query: { floor: '2', apartment: id, utm_source: 'test' },
  })

  mountQuerySync(router, {
    threeScene: ref({
      selectFloorByNumber: () => {
        selectedFloor.value = floor
      },
    }),
    selectedFloor,
    selectedApartment,
    onClose: vi.fn(),
    onApartmentSelect,
    onApartmentBack: vi.fn(),
  })

  await vi.waitFor(() => {
    expect(router.currentRoute.value.query).toEqual({
      floor: '2',
      utm_source: 'test',
    })
  })

  expect(selectedFloor.value).toEqual(floor)
  expect(onApartmentSelect).not.toHaveBeenCalled()
})
