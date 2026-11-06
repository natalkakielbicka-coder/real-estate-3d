import { describe, expect, it } from 'vitest'
import { getTotalApartmentArea } from '../getTotalApartmentArea'

describe('getTotalApartmentArea', () => {
  it('calculates total apartment area', () => {
    const apartments = [{ area: 40 }, { area: 50 }, { area: 60 }]

    expect(getTotalApartmentArea(apartments)).toBe(150)
  })

  it('returns zero for an empty array', () => {
    expect(getTotalApartmentArea([])).toBe(0)
  })

  it('handles a single apartment', () => {
    expect(getTotalApartmentArea([{ area: 52.5 }])).toBe(52.5)
  })

  it('supports decimal areas', () => {
    const apartments = [{ area: 40.5 }, { area: 35.2 }]

    expect(getTotalApartmentArea(apartments)).toBeCloseTo(75.7)
  })

  it('ignores apartments with missing area', () => {
    const apartments = [{ area: 40 }, {}, { area: 60 }]

    expect(getTotalApartmentArea(apartments)).toBe(100)
  })

  it('ignores null, negative and zero areas', () => {
    const apartments = [{ area: 40 }, { area: null }, { area: -10 }, { area: 0 }, { area: 60 }]

    expect(getTotalApartmentArea(apartments)).toBe(100)
  })

  it('ignores non-numeric areas', () => {
    const apartments = [{ area: 40 }, { area: '50' }, { area: NaN }, { area: Infinity }]

    expect(getTotalApartmentArea(apartments)).toBe(40)
  })

  it('does not mutate the original array', () => {
    const apartments = [
      { id: 1, area: 40 },
      { id: 2, area: 60 },
    ]

    getTotalApartmentArea(apartments)

    expect(apartments).toEqual([
      { id: 1, area: 40 },
      { id: 2, area: 60 },
    ])
  })
})
