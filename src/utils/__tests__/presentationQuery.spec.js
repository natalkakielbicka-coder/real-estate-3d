import { describe, expect, it } from 'vitest'
import { buildPresentationQuery, parsePresentationQuery } from '../presentationQuery'

describe('parsePresentationQuery', () => {
  it('parses floor and apartment', () => {
    expect(parsePresentationQuery({ floor: '2', apartment: 'A-2-1' })).toEqual({
      floorNumber: 2,
      apartmentId: 'A-2-1',
    })
  })

  it('parses ground floor', () => {
    expect(parsePresentationQuery({ floor: '0' }).floorNumber).toBe(0)
  })

  it('returns nulls for empty query', () => {
    expect(parsePresentationQuery({})).toEqual({ floorNumber: null, apartmentId: null })
  })

  it('ignores invalid floor', () => {
    expect(parsePresentationQuery({ floor: 'abc' }).floorNumber).toBeNull()
    expect(parsePresentationQuery({ floor: '1.5' }).floorNumber).toBeNull()
  })

  it('takes first value from repeated params', () => {
    expect(parsePresentationQuery({ floor: ['3', '4'] }).floorNumber).toBe(3)
  })
})

describe('buildPresentationQuery', () => {
  const floor = { floorNumber: 1 }
  const apartment = { id: 'A-1-2' }

  it('returns empty query without floor', () => {
    expect(buildPresentationQuery({})).toEqual({})
  })

  it('builds floor query', () => {
    expect(buildPresentationQuery({ floor })).toEqual({ floor: 1 })
  })

  it('builds floor and apartment query', () => {
    expect(buildPresentationQuery({ floor, apartment })).toEqual({
      floor: 1,
      apartment: 'A-1-2',
    })
  })
})
