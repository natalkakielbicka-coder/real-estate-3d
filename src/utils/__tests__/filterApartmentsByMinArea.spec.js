import { describe, expect, it } from 'vitest'
import { filterApartmentsByMinArea } from '../filterApartmentsByMinArea'

describe('filterApartmentsByMinArea', () => {
  const apartments = [
    { id: 1, area: 35 },
    { id: 2, area: 45 },
    { id: 3, area: 60 },
    { id: 4, area: 75 },
  ]

  it('filters apartments by minimum area', () => {
    const result = filterApartmentsByMinArea(apartments, 45)

    expect(result.map((apartment) => apartment.id)).toEqual([2, 3, 4])
  })

  it('includes apartments with exactly matching area', () => {
    const result = filterApartmentsByMinArea(apartments, 60)

    expect(result.map((apartment) => apartment.id)).toEqual([3, 4])
  })

  it('returns all apartments when minimum area is null', () => {
    expect(filterApartmentsByMinArea(apartments, null)).toEqual(apartments)
  })

  it('returns all apartments when minimum area is empty', () => {
    expect(filterApartmentsByMinArea(apartments, '')).toEqual(apartments)
  })

  it('returns an empty array when none match', () => {
    expect(filterApartmentsByMinArea(apartments, 100)).toEqual([])
  })

  it('handles an empty array', () => {
    expect(filterApartmentsByMinArea([], 50)).toEqual([])
  })

  it('ignores apartments with invalid area', () => {
    const result = filterApartmentsByMinArea(
      [{ id: 1, area: 50 }, { id: 2, area: null }, { id: 3 }, { id: 4, area: '60' }],
      40,
    )

    expect(result.map((apartment) => apartment.id)).toEqual([1])
  })

  it('does not mutate the original array', () => {
    filterApartmentsByMinArea(apartments, 50)

    expect(apartments.map((apartment) => apartment.id)).toEqual([1, 2, 3, 4])
  })
})
