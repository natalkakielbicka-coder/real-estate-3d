import { describe, expect, it } from 'vitest'
import { getAverageApartmentArea } from '../getAverageApartmentArea'

describe('getAverageApartmentArea', () => {
  it('calculates the average area', () => {
    const apartments = [{ area: 40 }, { area: 50 }, { area: 60 }]

    expect(getAverageApartmentArea(apartments)).toBe(50)
  })

  it('returns zero for an empty array', () => {
    expect(getAverageApartmentArea([])).toBe(0)
  })

  it('ignores apartments with missing area', () => {
    const apartments = [{ area: 40 }, {}, { area: 60 }]

    expect(getAverageApartmentArea(apartments)).toBe(50)
  })

  it('ignores null and negative areas', () => {
    const apartments = [{ area: 40 }, { area: null }, { area: -10 }, { area: 60 }]

    expect(getAverageApartmentArea(apartments)).toBe(50)
  })

  it('supports decimal areas', () => {
    const apartments = [{ area: 40.5 }, { area: 41.5 }]

    expect(getAverageApartmentArea(apartments)).toBe(41)
  })

  it('returns zero when all areas are invalid', () => {
    const apartments = [{ area: null }, { area: -20 }, { area: '50' }, {}]

    expect(getAverageApartmentArea(apartments)).toBe(0)
  })

  it('handles a single apartment', () => {
    expect(getAverageApartmentArea([{ area: 52.5 }])).toBe(52.5)
  })

  it('does not mutate the original array', () => {
    const apartments = [
      { id: 1, area: 40 },
      { id: 2, area: 60 },
    ]

    getAverageApartmentArea(apartments)

    expect(apartments).toEqual([
      { id: 1, area: 40 },
      { id: 2, area: 60 },
    ])
  })
})
