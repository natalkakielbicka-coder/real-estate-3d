import { describe, expect, it } from 'vitest'
import { filterApartmentsByPrice } from '../filterApartmentsByPrice'
import { filterApartmentsByBalcony } from '../filterApartmentsByBalcony'

describe('combined apartment filters', () => {
  it('filters apartments by price and balcony', () => {
    const apartments = [
      { id: 1, price: 400000, balcony: true },
      { id: 2, price: 500000, balcony: false },
      { id: 3, price: 600000, balcony: true },
      { id: 4, price: 450000, balcony: true },
    ]

    const maxPrice = 500000

    const affordableApartments = filterApartmentsByPrice(apartments, maxPrice)
    const result = filterApartmentsByBalcony(affordableApartments)

    expect(result.map((apartment) => apartment.id)).toEqual([1, 4])
  })
})
