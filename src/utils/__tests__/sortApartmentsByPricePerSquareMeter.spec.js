import { describe, expect, it } from 'vitest'
import { sortApartmentsByPricePerSquareMeter } from '../sortApartmentsByPricePerSquareMeter'

describe('sortApartmentsByPricePerSquareMeter', () => {
  const apartments = [
    { id: 1, price: 600000, area: 40 },
    { id: 2, price: 500000, area: 50 },
    { id: 3, price: 720000, area: 60 },
  ]

  it('sorts apartments by lowest price per square meter', () => {
    const result = sortApartmentsByPricePerSquareMeter(apartments)

    expect(result.map((apartment) => apartment.id)).toEqual([2, 3, 1])
  })

  it('does not mutate the original array', () => {
    sortApartmentsByPricePerSquareMeter(apartments)

    expect(apartments[0].id).toBe(1)
  })

  it('moves apartments with invalid area to the end', () => {
    const result = sortApartmentsByPricePerSquareMeter([
      { id: 1, price: 100000, area: 0 },
      { id: 2, price: 200000, area: 40 },
    ])

    expect(result.map((apartment) => apartment.id)).toEqual([2, 1])
  })

  it('handles an empty array', () => {
    expect(sortApartmentsByPricePerSquareMeter([])).toEqual([])
  })
})
