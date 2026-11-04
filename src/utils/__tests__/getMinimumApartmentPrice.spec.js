import { describe, expect, it } from 'vitest'
import { getMinimumApartmentPrice } from '../getMinimumApartmentPrice'

describe('getMinimumApartmentPrice', () => {
  it('returns the lowest apartment price', () => {
    const apartments = [
      { id: 1, price: 500000 },
      { id: 2, price: 300000 },
      { id: 3, price: 400000 },
    ]

    const result = getMinimumApartmentPrice(apartments)

    expect(result).toBe(300000)
  })
  it('returns null if there are no apartments', () => {
    const apartments = []

    const result = getMinimumApartmentPrice(apartments)

    expect(result).toBeNull()
  })
  it('ignores apartments with invalid prices', () => {
    const apartments = [
      { id: 1, price: 500000 },
      { id: 2, price: -300000 },
      { id: 3, price: 'invalid' },
      { id: 4, price: 400000 },
    ]

    const result = getMinimumApartmentPrice(apartments)

    expect(result).toBe(400000)
  })
  it('returns the lowest price when there are apartments with valid and invalid prices', () => {
    const apartments = [
      { id: 1, price: 500000 },
      { id: 2, price: -300000 },
      { id: 3, price: 'invalid' },
      { id: 4, price: 400000 },
      { id: 5, price: null },
    ]
    const result = getMinimumApartmentPrice(apartments)

    expect(result).toBe(400000)
  })
  it('returns null when all apartments have invalid prices', () => {
    const apartments = [
      { id: 1, price: -500000 },
      { id: 2, price: 'invalid' },
      { id: 3, price: null },
    ]
    const result = getMinimumApartmentPrice(apartments)

    expect(result).toBeNull()
  })
  it('returns zero when there is an apartment with a price of zero', () => {
    const apartments = [
      { id: 1, price: 500000 },
      { id: 2, price: 0 },
      { id: 3, price: 400000 },
    ]
    const result = getMinimumApartmentPrice(apartments)

    expect(result).toBe(0)
  })
})
