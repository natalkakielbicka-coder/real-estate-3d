import { defineComponent, nextTick, ref } from 'vue'
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

  await router.push('/?floor=2&apartment=A-2-1&utm_source=test#model')

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
    expect(router.currentRoute.value.hash).toBe('#model')
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
    hash: '#model',
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
    expect(router.currentRoute.value.hash).toBe('#model')
    expect(router.currentRoute.value.query).toEqual({
      floor: '2',
      utm_source: 'test',
    })
  })

  expect(selectedFloor.value).toEqual(floor)
  expect(onApartmentSelect).not.toHaveBeenCalled()
})

it('keeps unrelated query parameters when the linked floor does not exist', async () => {
  const selectFloorByNumber = vi.fn()
  const onClose = vi.fn()
  const onApartmentSelect = vi.fn()
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })

  await router.push('/?floor=999&apartment=missing&utm_source=test#model')

  mountQuerySync(router, {
    threeScene: ref({ selectFloorByNumber }),
    selectedFloor: ref(null),
    selectedApartment: ref(null),
    onClose,
    onApartmentSelect,
    onApartmentBack: vi.fn(),
  })

  await vi.waitFor(() => {
    expect(router.currentRoute.value.hash).toBe('#model')
    expect(router.currentRoute.value.query).toEqual({ utm_source: 'test' })
  })

  expect(selectFloorByNumber).toHaveBeenCalledWith(999)
  expect(onClose).toHaveBeenCalled()
  expect(onApartmentSelect).not.toHaveBeenCalled()
})

it('opens an available apartment from a direct link', async () => {
  const apartment = { id: 'A-2-1', status: 'available' }
  const floor = { floorNumber: 2, apartments: [apartment] }
  const selectedFloor = ref(null)
  const selectedApartment = ref(null)
  const selectFloorByNumber = vi.fn(() => {
    selectedFloor.value = floor
  })
  const onApartmentSelect = vi.fn((item) => {
    selectedApartment.value = item
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })

  await router.push('/?floor=2&apartment=A-2-1')

  mountQuerySync(router, {
    threeScene: ref({ selectFloorByNumber }),
    selectedFloor,
    selectedApartment,
    onClose: vi.fn(),
    onApartmentSelect,
    onApartmentBack: vi.fn(),
  })

  expect(selectFloorByNumber).toHaveBeenCalledWith(2)
  expect(selectedFloor.value).toEqual(floor)
  expect(onApartmentSelect).toHaveBeenCalledWith(apartment)
  expect(selectedApartment.value).toEqual(apartment)
})

it('preserves floor, unrelated query parameters and the URL fragment when leaving apartment details', async () => {
  const apartment = { id: 'A-2-1', status: 'available' }
  const floor = { floorNumber: 2, apartments: [apartment] }
  const selectedFloor = ref(floor)
  const selectedApartment = ref(apartment)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })

  await router.push('/?floor=2&apartment=A-2-1&utm_source=test#model')

  mountQuerySync(router, {
    threeScene: ref({ selectFloorByNumber: vi.fn() }),
    selectedFloor,
    selectedApartment,
    onClose: vi.fn(),
    onApartmentSelect: vi.fn(),
    onApartmentBack: vi.fn(),
  })

  selectedApartment.value = null

  await vi.waitFor(() => {
    expect(router.currentRoute.value.hash).toBe('#model')
    expect(router.currentRoute.value.query).toEqual({ floor: '2', utm_source: 'test' })
  })

  expect(selectedFloor.value).toEqual(floor)
})

it('keeps the current floor when the URL points to another apartment on it', async () => {
  const firstApartment = { id: 'A-2-1', status: 'available' }
  const secondApartment = { id: 'A-2-2', status: 'available' }
  const floor = { floorNumber: 2, apartments: [firstApartment, secondApartment] }
  const selectedFloor = ref(floor)
  const selectedApartment = ref(firstApartment)
  const selectFloorByNumber = vi.fn()
  const onApartmentSelect = vi.fn((apartment) => {
    selectedApartment.value = apartment
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })

  await router.push('/?floor=2&apartment=A-2-1')

  mountQuerySync(router, {
    threeScene: ref({ selectFloorByNumber }),
    selectedFloor,
    selectedApartment,
    onClose: vi.fn(),
    onApartmentSelect,
    onApartmentBack: vi.fn(),
  })

  await router.push('/?floor=2&apartment=A-2-2')

  await vi.waitFor(() => {
    expect(onApartmentSelect).toHaveBeenCalledExactlyOnceWith(secondApartment)
  })

  expect(selectedApartment.value).toEqual(secondApartment)
  expect(selectedFloor.value).toEqual(floor)
  expect(selectFloorByNumber).not.toHaveBeenCalled()
})

it('does not resolve the selection again when unrelated URL values change', async () => {
  const apartment = { id: 'A-2-1', status: 'available' }
  const readApartments = vi.fn(() => [apartment])
  const selectedFloor = ref({
    floorNumber: 2,
    get apartments() {
      return readApartments()
    },
  })
  const selectedApartment = ref(apartment)
  const selectFloorByNumber = vi.fn()
  const onApartmentSelect = vi.fn()
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { render: () => null } }],
  })

  await router.push('/?floor=2&apartment=A-2-1&utm_source=old#model')

  mountQuerySync(router, {
    threeScene: ref({ selectFloorByNumber }),
    selectedFloor,
    selectedApartment,
    onClose: vi.fn(),
    onApartmentSelect,
    onApartmentBack: vi.fn(),
  })

  expect(readApartments).toHaveBeenCalledOnce()
  readApartments.mockClear()

  await router.push('/?floor=2&apartment=A-2-1&utm_source=new#details')
  await nextTick()

  expect(router.currentRoute.value.query.utm_source).toBe('new')
  expect(router.currentRoute.value.hash).toBe('#details')
  expect(selectedFloor.value.floorNumber).toBe(2)
  expect(selectedApartment.value).toEqual(apartment)
  expect(readApartments).not.toHaveBeenCalled()
  expect(selectFloorByNumber).not.toHaveBeenCalled()
  expect(onApartmentSelect).not.toHaveBeenCalled()
})
