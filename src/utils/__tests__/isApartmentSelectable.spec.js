import { describe, expect, it } from 'vitest'
import { isApartmentSelectable } from '../isApartmentSelectable'

describe('isApartmentSelectable', () => {
  it('allows available apartments', () => {
    expect(isApartmentSelectable({ status: 'available' })).toBe(true)
  })

  it('allows reserved apartments', () => {
    expect(isApartmentSelectable({ status: 'reserved' })).toBe(true)
  })

  it('blocks sold apartments', () => {
    expect(isApartmentSelectable({ status: 'sold' })).toBe(false)
  })

  it('blocks missing apartments', () => {
    expect(isApartmentSelectable(null)).toBe(false)
    expect(isApartmentSelectable(undefined)).toBe(false)
  })
})
