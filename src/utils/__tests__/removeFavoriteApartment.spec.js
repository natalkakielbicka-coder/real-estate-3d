import { describe, expect, it } from 'vitest'
import { removeFavoriteApartment } from '../removeFavoriteApartment'

describe('removeFavoriteApartment', () => {
  it('removes an existing apartment ID from the favorites', () => {
    const favoriteIds = ['a', 'b', 'c']
    const apartmentId = 'b'

    expect(removeFavoriteApartment(favoriteIds, apartmentId)).toEqual(['a', 'c'])
  })

  it('does not remove an apartment ID that is not in the favorites', () => {
    const favoriteIds = ['a', 'b', 'c']
    const apartmentId = 'd'

    expect(removeFavoriteApartment(favoriteIds, apartmentId)).toEqual(['a', 'b', 'c'])
  })

  it('returns a new array and does not mutate the original favorites array', () => {
    const favoriteIds = ['a', 'b', 'c']
    const apartmentId = 'b'

    const result = removeFavoriteApartment(favoriteIds, apartmentId)
    expect(result).toEqual(['a', 'c'])
    expect(favoriteIds).toEqual(['a', 'b', 'c'])
    expect(result).not.toBe(favoriteIds)
  })

  it('returns a new array even if the apartment ID is not present', () => {
    const favoriteIds = ['a', 'b', 'c']
    const apartmentId = 'd'

    const result = removeFavoriteApartment(favoriteIds, apartmentId)
    expect(result).toEqual(['a', 'b', 'c'])
    expect(result).not.toBe(favoriteIds)
  })

  it('returns a new array even if the favorites array is empty', () => {
    const favoriteIds = []
    const apartmentId = 'a'

    const result = removeFavoriteApartment(favoriteIds, apartmentId)
    expect(result).toEqual([])
    expect(result).not.toBe(favoriteIds)
  })
})
