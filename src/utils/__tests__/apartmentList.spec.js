import { describe, expect, it } from 'vitest'
import {
  getAdjacentApartments,
  sortApartmentsByStatus,
  sortApartmentsByArea,
  sortApartmentsByPriceAsc,
  sortApartmentsByPriceDesc,
} from '../apartmentList'

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

describe('sortApartmentsByPriceAsc', () => {
  it('sorts apartments by price from lowest to highest', () => {
    const apartments = [
      { id: 1, price: 650000 },
      { id: 2, price: 420000 },
      { id: 3, price: 510000 },
    ]

    const result = sortApartmentsByPriceAsc(apartments)

    expect(result.map((apartment) => apartment.id)).toEqual([2, 3, 1])
  })

  it('preserves order for apartments with equal prices', () => {
    const apartments = [
      { id: 1, price: 500000 },
      { id: 2, price: 300000 },
      { id: 3, price: 500000 },
      { id: 4, price: 400000 },
    ]

    const result = sortApartmentsByPriceAsc(apartments)

    expect(result.map((apartment) => apartment.id)).toEqual([2, 4, 1, 3])
  })
})

describe('sortApartmentsByPriceDesc', () => {
  it('sorts apartments by price from highest to lowest', () => {
    const apartments = [
      { id: 1, price: 420000 },
      { id: 2, price: 650000 },
      { id: 3, price: 510000 },
    ]

    const result = sortApartmentsByPriceDesc(apartments)

    expect(result.map((apartment) => apartment.id)).toEqual([2, 3, 1])
  })
})

describe('sortApartmentsByArea', () => {
  it('sorts apartments by area from smallest to largest', () => {
    const apartments = [
      { id: 1, area: 65 },
      { id: 2, area: 38 },
      { id: 3, area: 52 },
      { id: 4, area: 44 },
    ]

    const result = sortApartmentsByArea(apartments)

    expect(result.map((apartment) => apartment.id)).toEqual([2, 4, 3, 1])
  })
})
