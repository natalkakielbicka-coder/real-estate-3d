import { describe, expect, it } from 'vitest'
import { getAverageApartmentPrice } from '../getAverageApartmentPrice'

describe('getAverageApartmentPrice', () => {
  it('calculates the average price of apartments', () => {
    const apartments = [{ price: 1000 }, { price: 2000 }, { price: 3000 }]
    expect(getAverageApartmentPrice(apartments)).toBe(2000)
  })
  it('returns 0 for empty array', () => {
    const apartments = []
    expect(getAverageApartmentPrice(apartments)).toBe(0)
  })
  it('ignores apartments with missing price property', () => {
    const apartments = [
      { price: 1000 },
      { price: 2000 },
      {}, // brak ceny
      { price: 3000 },
    ]
    expect(getAverageApartmentPrice(apartments)).toBe(2000)
  })
  it('ignores apartments with non-numeric price', () => {
    const apartments = [
      { price: 1000 },
      { price: 'not a number' }, // niepoprawna cena
      { price: 3000 },
    ]
    expect(getAverageApartmentPrice(apartments)).toBe(2000)
  })
})
