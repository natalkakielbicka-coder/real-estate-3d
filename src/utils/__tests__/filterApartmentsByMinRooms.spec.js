import { describe, expect, it } from 'vitest'
import { filterApartmentsByMinRooms } from '../filterApartmentsByMinRooms'

describe('filterApartmentsByMinRooms', () => {
  const apartments = [
    { id: 1, rooms: 1 },
    { id: 2, rooms: 2 },
    { id: 3, rooms: 3 },
    { id: 4, rooms: 4 },
  ]

  it('filters apartments with at least 3 rooms', () => {
    const result = filterApartmentsByMinRooms(apartments, 3)

    expect(result.map((apartment) => apartment.id)).toEqual([3, 4])
  })

  it('includes apartments with exactly 2 rooms', () => {
    const result = filterApartmentsByMinRooms(apartments, 2)

    expect(result.map((apartment) => apartment.id)).toEqual([2, 3, 4])
  })

  it('returns all apartments when minimum is null', () => {
    expect(filterApartmentsByMinRooms(apartments, null)).toEqual(apartments)
  })

  it('returns all apartments when minimum is empty', () => {
    expect(filterApartmentsByMinRooms(apartments, '')).toEqual(apartments)
  })

  it('returns an empty array when none match', () => {
    expect(filterApartmentsByMinRooms(apartments, 5)).toEqual([])
  })

  it('does not mutate the original array', () => {
    filterApartmentsByMinRooms(apartments, 3)

    expect(apartments).toHaveLength(4)
    expect(apartments[0].id).toBe(1)
  })

  it('ignores apartments without a valid room count', () => {
    const result = filterApartmentsByMinRooms(
      [{ id: 1, rooms: 2 }, { id: 2 }, { id: 3, rooms: '3' }],
      2,
    )

    expect(result.map((apartment) => apartment.id)).toEqual([1])
  })
})
