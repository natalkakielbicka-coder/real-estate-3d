import { describe, expect, it } from 'vitest'
import { countApartmentsWithBalcony } from '../countApartmentsWithBalcony'

describe('countApartmentsWithBalcony', () => {
  it('counts apartments with balcony', () => {
    const apartments = [
      { id: 1, balcony: true },
      { id: 2, balcony: false },
      { id: 3, balcony: true },
    ]
    expect(countApartmentsWithBalcony(apartments)).toBe(2)
  })
  it('returns 0 when no apartments have balcony', () => {
    const apartments = [
      { id: 1, balcony: false },
      { id: 2, balcony: false },
    ]
    expect(countApartmentsWithBalcony(apartments)).toBe(0)
  })
  it('returns 0 when input is empty', () => {
    const apartments = []
    expect(countApartmentsWithBalcony(apartments)).toBe(0)
  })
})
