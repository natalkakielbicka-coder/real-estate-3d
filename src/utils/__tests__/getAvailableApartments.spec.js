import { describe, expect, it } from 'vitest'
import { getAvailableApartments } from '../getAvailableApartments'

describe('getAvailableApartments', () => {
  const apartments = [
    { id: 1, status: 'available' },
    { id: 2, status: 'sold' },
    { id: 3, status: 'reserved' },
    { id: 4, status: 'available' },
  ]

  it('returns only available apartments', () => {
    const result = getAvailableApartments(apartments)

    expect(result.map((apartment) => apartment.id)).toEqual([1, 4])
  })

  it('returns an empty array when all apartments are sold', () => {
    const result = getAvailableApartments([
      { id: 1, status: 'sold' },
      { id: 2, status: 'sold' },
    ])

    expect(result).toEqual([])
  })

  it('returns an empty array when all apartments are reserved', () => {
    const result = getAvailableApartments([
      { id: 1, status: 'reserved' },
      { id: 2, status: 'reserved' },
    ])

    expect(result).toEqual([])
  })

  it('handles an empty array', () => {
    expect(getAvailableApartments([])).toEqual([])
  })

  it('ignores apartments with missing status', () => {
    const result = getAvailableApartments([
      { id: 1, status: 'available' },
      { id: 2 },
      { id: 3, status: null },
    ])

    expect(result.map((apartment) => apartment.id)).toEqual([1])
  })

  it('does not mutate the original array', () => {
    getAvailableApartments(apartments)

    expect(apartments.map((apartment) => apartment.id)).toEqual([1, 2, 3, 4])
  })

  it('preserves the original order of available apartments', () => {
    const result = getAvailableApartments([
      { id: 3, status: 'available' },
      { id: 1, status: 'sold' },
      { id: 2, status: 'available' },
    ])

    expect(result.map((apartment) => apartment.id)).toEqual([3, 2])
  })
})
