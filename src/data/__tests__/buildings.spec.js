import { describe, expect, it } from 'vitest'
import { buildings } from '../buildings'
import { apartmentStatuses } from '../../constants/apartmentStatuses'
import { getAllApartments } from '../../utils/getAllApartments'

const apartments = getAllApartments(buildings)
const validStatuses = Object.keys(apartmentStatuses)

describe('building data', () => {
  it('contains at least one building', () => {
    expect(buildings.length).toBeGreaterThan(0)
  })

  it('contains apartments', () => {
    expect(apartments.length).toBeGreaterThan(0)
  })

  it('has unique building IDs', () => {
    const ids = buildings.map((building) => building.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique apartment IDs', () => {
    const ids = apartments.map((apartment) => apartment.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has valid apartment statuses', () => {
    apartments.forEach((apartment) => {
      expect(validStatuses).toContain(apartment.status)
    })
  })

  it('has positive apartment prices', () => {
    apartments.forEach((apartment) => {
      expect(Number.isFinite(apartment.price)).toBe(true)
      expect(apartment.price).toBeGreaterThan(0)
    })
  })

  it('has positive apartment areas', () => {
    apartments.forEach((apartment) => {
      expect(Number.isFinite(apartment.area)).toBe(true)
      expect(apartment.area).toBeGreaterThan(0)
    })
  })

  it('has valid room counts', () => {
    apartments.forEach((apartment) => {
      expect(Number.isInteger(apartment.rooms)).toBe(true)
      expect(apartment.rooms).toBeGreaterThan(0)
    })
  })

  it('has valid floor numbers', () => {
    apartments.forEach((apartment) => {
      expect(Number.isInteger(apartment.floorNumber)).toBe(true)
      expect(apartment.floorNumber).toBeGreaterThanOrEqual(0)
    })
  })

  it('preserves building information in flattened apartments', () => {
    apartments.forEach((apartment) => {
      const building = buildings.find((item) => item.id === apartment.buildingId)

      expect(building).toBeDefined()
      expect(apartment.buildingName).toBe(building.name)
      expect(building.floors.some((floor) => floor.floorNumber === apartment.floorNumber)).toBe(
        true,
      )
    })
  })
})
