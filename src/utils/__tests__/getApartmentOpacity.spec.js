import { describe, expect, it } from 'vitest'
import { getApartmentOpacity } from '../getApartmentOpacity'

const defaults = {
  isSelected: false,
  hasSelectedApartment: false,
  matchesSearch: true,
  unmatchedOpacity: 0.15,
  unselectedOpacity: 0.3,
}

const getOpacity = (overrides = {}) =>
  getApartmentOpacity({
    ...defaults,
    ...overrides,
  })

describe('getApartmentOpacity', () => {
  it('returns full opacity for matching apartments', () => {
    expect(getOpacity()).toBe(1)
  })

  it('dims apartments outside search results', () => {
    expect(
      getOpacity({
        matchesSearch: false,
      }),
    ).toBe(0.15)
  })

  it('keeps selected apartment fully visible', () => {
    expect(
      getOpacity({
        isSelected: true,
        hasSelectedApartment: true,
      }),
    ).toBe(1)
  })

  it('dims unselected apartments', () => {
    expect(
      getOpacity({
        hasSelectedApartment: true,
      }),
    ).toBe(0.3)
  })

  it('keeps the lower opacity for unmatched apartments', () => {
    expect(
      getOpacity({
        hasSelectedApartment: true,
        matchesSearch: false,
      }),
    ).toBe(0.15)
  })

  it('never increases opacity of unmatched apartments', () => {
    expect(
      getOpacity({
        hasSelectedApartment: true,
        matchesSearch: false,
        unmatchedOpacity: 0.5,
        unselectedOpacity: 0.2,
      }),
    ).toBe(0.2)
  })

  it('prioritizes the selected apartment', () => {
    expect(
      getOpacity({
        isSelected: true,
        hasSelectedApartment: true,
        matchesSearch: false,
      }),
    ).toBe(1)
  })
})
