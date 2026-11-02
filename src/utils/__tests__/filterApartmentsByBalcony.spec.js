import { describe, expect, it } from 'vitest'
import { filterApartmentsByBalcony } from '../filterApartmentsByBalcony'

describe('filterApartmentsByBalcony', () => {
  it('filters apartments with balcony', () => {
    const apartments = [
      { id: 1, balcony: true },
      { id: 2, balcony: false },
      { id: 3, balcony: true },
    ]
    const filteredApartments = filterApartmentsByBalcony(apartments)
    expect(filteredApartments).toHaveLength(2)
    expect(filteredApartments[0]).toEqual({ id: 1, balcony: true })
    expect(filteredApartments[1]).toEqual({ id: 3, balcony: true })
  })
  it('returns empty array when no apartments have balcony', () => {
    const apartments = [
      { id: 1, balcony: false },
      { id: 2, balcony: false },
    ]
    const filteredApartments = filterApartmentsByBalcony(apartments)
    expect(filteredApartments).toHaveLength(0)
  })
})
