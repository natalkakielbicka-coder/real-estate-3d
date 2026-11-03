import { describe, expect, it } from 'vitest'
import { isApartmentWithinBudget } from '../isApartmentWithinBudget'

describe('isApartmentWithinBudget', () => {
  it('returns true when apartment price is less than maxPrice', () => {
    const apartment = { price: 1000 }
    const maxPrice = 1500
    expect(isApartmentWithinBudget(apartment, maxPrice)).toBe(true)
  })

  it('returns true when apartment price is equal to maxPrice', () => {
    const apartment = { price: 1500 }
    const maxPrice = 1500
    expect(isApartmentWithinBudget(apartment, maxPrice)).toBe(true)
  })

  it('returns false when apartment price is greater than maxPrice', () => {
    const apartment = { price: 2000 }
    const maxPrice = 1500
    expect(isApartmentWithinBudget(apartment, maxPrice)).toBe(false)
  })

  it('returns false when apartment is null', () => {
    const apartment = null
    const maxPrice = 1500
    expect(isApartmentWithinBudget(apartment, maxPrice)).toBe(false)
  })

  it('returns false when apartment price is not a number', () => {
    const apartment = { price: 'not a number' }
    const maxPrice = 1500
    expect(isApartmentWithinBudget(apartment, maxPrice)).toBe(false)
  })
})
