import { describe, expect, it } from 'vitest'
import { getAdjacentApartments, sortApartmentsByStatus } from '../apartmentList'

const apartments = [
  { id: 'a', status: 'sold' },
  { id: 'b', status: 'available' },
  { id: 'c', status: 'reserved' },
  { id: 'd', status: 'available' },
]

describe('sortApartmentsByStatus', () => {
  it('orders available, reserved, sold', () => {
    expect(sortApartmentsByStatus(apartments).map((item) => item.id)).toEqual(['b', 'd', 'c', 'a'])
  })

  it('does not mutate the input', () => {
    sortApartmentsByStatus(apartments)

    expect(apartments[0].id).toBe('a')
  })
})

describe('getAdjacentApartments', () => {
  it('returns previous and next', () => {
    const { previous, next } = getAdjacentApartments(apartments, 'b')

    expect(previous.id).toBe('a')
    expect(next.id).toBe('c')
  })

  it('returns null previous for the first item', () => {
    expect(getAdjacentApartments(apartments, 'a').previous).toBeNull()
  })

  it('returns null next for the last item', () => {
    expect(getAdjacentApartments(apartments, 'd').next).toBeNull()
  })

  it('returns nulls for unknown id', () => {
    expect(getAdjacentApartments(apartments, 'x')).toEqual({ previous: null, next: null })
  })
})
