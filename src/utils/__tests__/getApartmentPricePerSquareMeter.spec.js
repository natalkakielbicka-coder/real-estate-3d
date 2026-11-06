import { describe, expect, it } from 'vitest'
import { getApartmentPricePerSquareMeter } from '../getApartmentPricePerSquareMeter'

describe('getApartmentPricePerSquareMeter', () => {
  it('calculates price per square meter', () => {
    expect(
      getApartmentPricePerSquareMeter({
        price: 500000,
        area: 50,
      }),
    ).toBe(10000)
  })

  it('returns null for zero area', () => {
    expect(
      getApartmentPricePerSquareMeter({
        price: 500000,
        area: 0,
      }),
    ).toBeNull()
  })

  it('returns null for missing price', () => {
    expect(getApartmentPricePerSquareMeter({ area: 50 })).toBeNull()
  })

  it('returns null for invalid apartment', () => {
    expect(getApartmentPricePerSquareMeter(null)).toBeNull()
  })

  it('returns null for negative price', () => {
    expect(
      getApartmentPricePerSquareMeter({
        price: -100,
        area: 50,
      }),
    ).toBeNull()
  })
})
