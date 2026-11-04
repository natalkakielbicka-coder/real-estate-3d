import { describe, it, expect } from 'vitest'
import { getMaximumApartmentPrice } from '../getMaximumApartmentPrice'

describe('getMaximumApartmentPrice', () => {
  it('returns the highest apartment price', () => {
    const apartments = [
      { id: 1, price: 500000 },
      { id: 2, price: 300000 },
      { id: 3, price: 400000 },
    ]

    const result = getMaximumApartmentPrice(apartments)

    expect(result).toBe(500000)
  })
  it('returns null if there are no apartments', () => {
    const apartments = []

    const result = getMaximumApartmentPrice(apartments)

    expect(result).toBeNull()
  })
  it('ignores apartments with invalid prices', () => {
    const apartments = [
      { id: 1, price: 500000 },
      { id: 2, price: -300000 },
      { id: 3, price: 'invalid' },
      { id: 4, price: 400000 },
    ]

    const result = getMaximumApartmentPrice(apartments)

    expect(result).toBe(500000)
  })
  it('returns null for apartments with null prices', () => {
    const apartments = [
      { id: 1, price: null },
      { id: 2, price: null },
      { id: 3, price: null },
    ]
    const result = getMaximumApartmentPrice(apartments)

    expect(result).toBeNull()
  })
  it('returns infinity for apartments with infinite prices', () => {
    const apartments = [
      { id: 1, price: Infinity },
      { id: 2, price: Infinity },
      { id: 3, price: Infinity },
    ]
    const result = getMaximumApartmentPrice(apartments)

    expect(result).toBe(null)
  })
  it('returns zero for apartments with zero prices', () => {
    const apartments = [
      { id: 1, price: 0 },
      { id: 2, price: 0 },
      { id: 3, price: 0 },
    ]
    const result = getMaximumApartmentPrice(apartments)

    expect(result).toBe(0)
  })
})
