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
  it('returns empty array when input is empty', () => {
    const apartments = []
    const filteredApartments = filterApartmentsByBalcony(apartments)
    expect(filteredApartments).toHaveLength(0)
  })
  it('ignores apartments without balcony property', () => {
    const apartments = [{ id: 1, balcony: true }, { id: 2 }, { id: 3, balcony: false }]
    const filteredApartments = filterApartmentsByBalcony(apartments)
    expect(filteredApartments).toHaveLength(1)
    expect(filteredApartments[0]).toEqual({ id: 1, balcony: true })
  })
  it('filters apartments with balcony in the correct order', () => {
    const apartments = [
      { id: 5, balcony: true },
      { id: 2, balcony: false },
      { id: 8, balcony: true },
      { id: 1, balcony: true },
    ]
    const filteredApartments = filterApartmentsByBalcony(apartments)
    expect(filteredApartments).toHaveLength(3)
    expect(filteredApartments[0]).toEqual({ id: 5, balcony: true })
    expect(filteredApartments[1]).toEqual({ id: 8, balcony: true })
    expect(filteredApartments[2]).toEqual({ id: 1, balcony: true })
  })
})
