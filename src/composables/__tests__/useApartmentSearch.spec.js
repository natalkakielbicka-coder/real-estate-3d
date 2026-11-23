import { expect, it } from 'vitest'
import { useApartmentSearch } from '../useApartmentSearch'

it('clears all search filters and restores the full apartment list', () => {
  const apartments = [
    { id: 'a', rooms: 2, status: 'available', area: 48, price: 420_000 },
    { id: 'b', rooms: 3, status: 'reserved', area: 65, price: 550_000 },
  ]
  const search = useApartmentSearch(apartments)

  search.toggleRoom(2)
  search.toggleStatus('available')
  search.minArea.value = 40
  search.maxArea.value = 55
  search.minPrice.value = 400_000
  search.maxPrice.value = 500_000

  expect(search.filteredApartments.value).toEqual([apartments[0]])

  search.resetFilters()

  expect(search.selectedRooms.value).toEqual([])
  expect(search.selectedStatuses.value).toEqual([])
  expect(search.minArea.value).toBe('')
  expect(search.maxArea.value).toBe('')
  expect(search.minPrice.value).toBe('')
  expect(search.maxPrice.value).toBe('')
  expect(search.filteredApartments.value).toEqual(apartments)
})
