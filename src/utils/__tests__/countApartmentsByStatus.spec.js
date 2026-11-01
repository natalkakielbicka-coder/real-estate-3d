import { describe, expect, it } from 'vitest'
import { countApartmentsByStatus } from '../countApartmentsByStatus'

describe('countApartmentsByStatus', () => {
  it('counts apartments for every status', () => {
    const apartments = [
      { status: 'available' },
      { status: 'available' },
      { status: 'reserved' },
      { status: 'sold' },
    ]

    expect(countApartmentsByStatus(apartments)).toEqual({
      available: 2,
      reserved: 1,
      sold: 1,
    })
  })

  it('returns zeros for known statuses when there are no apartments', () => {
    expect(countApartmentsByStatus([])).toEqual({
      available: 0,
      reserved: 0,
      sold: 0,
    })
  })

  it('handles missing apartments list', () => {
    expect(countApartmentsByStatus()).toEqual({
      available: 0,
      reserved: 0,
      sold: 0,
    })
  })

  it('does not hide unknown statuses', () => {
    expect(countApartmentsByStatus([{ status: 'blocked' }])).toMatchObject({
      blocked: 1,
    })
  })
})
