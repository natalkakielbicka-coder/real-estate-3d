import { describe, expect, it } from 'vitest'
import { parseStoredFavorites } from '../parseStoredFavorites'

describe('parseStoredFavorites', () => {
  it('parses a valid JSON string into an array of favorite IDs', () => {
    const storedValue = '["a", "b", "c"]'
    expect(parseStoredFavorites(storedValue)).toEqual(['a', 'b', 'c'])
  })

  it('returns an empty array for an invalid JSON string', () => {
    const storedValue = 'invalid json'
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })

  it('returns an empty array for a JSON string that is not an array', () => {
    const storedValue = '{"a": 1, "b": 2}'
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })

  it('returns an empty array for a null value', () => {
    const storedValue = null
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })

  it('returns an empty array for an undefined value', () => {
    const storedValue = undefined
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })

  it('returns an empty array for an empty string', () => {
    const storedValue = ''
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })

  it('returns an empty array for a number', () => {
    const storedValue = 123
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })

  it('returns an empty array for a boolean', () => {
    const storedValue = true
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })

  it('returns an empty array for an object', () => {
    const storedValue = { a: 1, b: 2 }
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })

  it('returns an empty array for a JSON array of numbers', () => {
    const storedValue = '[1, 2, 3]'
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })

  it('returns an empty array for a JSON array with mixed types', () => {
    const storedValue = '["A-1-1", 123]'
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })

  it('returns an empty array for an empty JSON array', () => {
    const storedValue = '[]'
    expect(parseStoredFavorites(storedValue)).toEqual([])
  })
})
