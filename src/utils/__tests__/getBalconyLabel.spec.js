import { describe, it, expect } from 'vitest'
import { getBalconyLabel } from '../getBalconyLabel'

describe('getBalconyLabel', () => {
  it('returns balcony label when balcony is true', () => {
    expect(getBalconyLabel(true)).toBe('Balkon')
  })
  it('returns no balcony label when balcony is false', () => {
    expect(getBalconyLabel(false)).toBe('Brak balkonu')
  })
  it('returns no data label when balcony is undefined', () => {
    expect(getBalconyLabel(undefined)).toBe('Brak danych')
  })
})
