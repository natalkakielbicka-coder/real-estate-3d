import { describe, expect, it } from 'vitest'
import { filterApartmentsByPrice } from '../filterApartmentsByPrice'

describe('filterApartmentsByPrice', () => {
  it('filters apartments within budget', () => {
    const apartments = [
      { id: 1, price: 100000 },
      { id: 2, price: 200000 },
      { id: 3, price: 300000 },
      { id: 4, price: 400000 },
      { id: 5, price: 500000 },
    ]
    const maxPrice = 300000
    const filteredApartments = filterApartmentsByPrice(apartments, maxPrice)
    expect(filteredApartments).toHaveLength(3)
    expect(filteredApartments[0]).toEqual({ id: 1, price: 100000 })
    expect(filteredApartments[1]).toEqual({ id: 2, price: 200000 })
    expect(filteredApartments[2]).toEqual({ id: 3, price: 300000 })
  })

  it('returns empty array when no apartments are within budget', () => {
    const apartments = [
      { id: 1, price: 400000 },
      { id: 2, price: 500000 },
    ]
    const maxPrice = 300000
    const filteredApartments = filterApartmentsByPrice(apartments, maxPrice)
    expect(filteredApartments).toHaveLength(0)
  })

  it('returns empty array when input is empty', () => {
    const apartments = []
    const maxPrice = 300000
    const filteredApartments = filterApartmentsByPrice(apartments, maxPrice)
    expect(filteredApartments).toHaveLength(0)
  })

  it('handles apartments with missing price property', () => {
    const apartments = [
      { id: 1, price: 100000 },
      { id: 2 }, // brak ceny
      { id: 3, price: 300000 },
    ]
    const maxPrice = 300000
    const filteredApartments = filterApartmentsByPrice(apartments, maxPrice)
    expect(filteredApartments).toHaveLength(2)
    expect(filteredApartments[0]).toEqual({ id: 1, price: 100000 })
    expect(filteredApartments[1]).toEqual({ id: 3, price: 300000 })
  })
})
