import { describe, expect, it } from 'vitest'
import { getMaxPriceError } from '../getMaxPriceError'

describe('getMaxPriceError', () => {
  it('returns no error for an empty value', () => {
    expect(getMaxPriceError(null)).toBe('')
    expect(getMaxPriceError('')).toBe('')
  })

  it('returns no error for zero', () => {
    expect(getMaxPriceError(0)).toBe('')
  })

  it('returns no error for a valid price', () => {
    expect(getMaxPriceError(500000)).toBe('')
  })

  it('returns an error for a negative price', () => {
    expect(getMaxPriceError(-100000)).toBe('Podaj poprawną cenę, nie mniejszą niż 0.')
  })

  it('returns an error for NaN', () => {
    expect(getMaxPriceError(NaN)).not.toBe('')
  })

  it('returns an error for Infinity', () => {
    expect(getMaxPriceError(Infinity)).not.toBe('')
  })

  it('returns an error for a non-numeric string', () => {
    expect(getMaxPriceError('abc')).not.toBe('')
  })
})
