import { describe, expect, it } from 'vitest'
import { getApartmentPriceRange } from '../getApartmentPriceRange'

describe('getApartmentPriceRange', () => {
  it('returns minimum and maximum prices', () => {
    const apartments = [{ price: 500000 }, { price: 350000 }, { price: 700000 }]

    expect(getApartmentPriceRange(apartments)).toEqual({
      min: 350000,
      max: 700000,
    })
  })

  it('handles a single apartment', () => {
    expect(getApartmentPriceRange([{ price: 400000 }])).toEqual({
      min: 400000,
      max: 400000,
    })
  })

  it('returns null values for an empty array', () => {
    expect(getApartmentPriceRange([])).toEqual({
      min: null,
      max: null,
    })
  })

  it('ignores apartments with missing prices', () => {
    const apartments = [{ price: 300000 }, {}, { price: 500000 }]

    expect(getApartmentPriceRange(apartments)).toEqual({
      min: 300000,
      max: 500000,
    })
  })

  it('ignores invalid prices', () => {
    const apartments = [
      { price: 300000 },
      { price: null },
      { price: -100 },
      { price: '400000' },
      { price: NaN },
      { price: Infinity },
      { price: 500000 },
    ]

    expect(getApartmentPriceRange(apartments)).toEqual({
      min: 300000,
      max: 500000,
    })
  })

  it('returns null values when all prices are invalid', () => {
    const apartments = [{ price: null }, { price: -100 }, { price: '500000' }, {}]

    expect(getApartmentPriceRange(apartments)).toEqual({
      min: null,
      max: null,
    })
  })

  it('handles apartments with equal prices', () => {
    const apartments = [{ price: 450000 }, { price: 450000 }, { price: 450000 }]

    expect(getApartmentPriceRange(apartments)).toEqual({
      min: 450000,
      max: 450000,
    })
  })

  it('does not mutate the original array', () => {
    const apartments = [
      { id: 1, price: 600000 },
      { id: 2, price: 400000 },
    ]

    getApartmentPriceRange(apartments)

    expect(apartments).toEqual([
      { id: 1, price: 600000 },
      { id: 2, price: 400000 },
    ])
  })
})
