import { describe, expect, it } from 'vitest'
import { getRangeError } from '../getRangeError'

const empty = { minArea: '', maxArea: '', minPrice: '', maxPrice: '' }

describe('getRangeError', () => {
  it('returns no error for empty filters', () => {
    expect(getRangeError(empty)).toBe('')
  })

  it('returns no error for valid ranges', () => {
    expect(getRangeError({ minArea: 40, maxArea: 60, minPrice: 1, maxPrice: 2 })).toBe('')
  })

  it('returns no error when only one side is set', () => {
    expect(getRangeError({ ...empty, minArea: 100 })).toBe('')
  })

  it('detects invalid area range', () => {
    expect(getRangeError({ ...empty, minArea: 80, maxArea: 40 })).toContain('powierzchnia')
  })

  it('detects invalid price range', () => {
    expect(getRangeError({ ...empty, minPrice: 900000, maxPrice: 500000 })).toContain('cena')
  })

  it('compares numbers, not strings', () => {
    expect(getRangeError({ ...empty, minArea: '9', maxArea: '10' })).toBe('')
  })
})
