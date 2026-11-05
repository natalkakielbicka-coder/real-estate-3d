import { describe, expect, it } from 'vitest'
import { addFavoriteApartment } from '../addFavoriteApartment'

describe('addFavoriteApartment', () => {
  it('adds a new apartment ID to the favorites if it is not already present', () => {
    const favoriteIds = ['a', 'b', 'c']
    const apartmentId = 'd'

    expect(addFavoriteApartment(favoriteIds, apartmentId)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('does not add an existing apartment ID to the favorites', () => {
    const favoriteIds = ['a', 'b', 'c']
    const apartmentId = 'b'

    expect(addFavoriteApartment(favoriteIds, apartmentId)).toEqual(['a', 'b', 'c'])
  })

  it('returns a new array and does not mutate the original favorites array', () => {
    const favoriteIds = ['a', 'b', 'c']
    const apartmentId = 'd'

    const result = addFavoriteApartment(favoriteIds, apartmentId)
    expect(result).toEqual(['a', 'b', 'c', 'd'])
    expect(favoriteIds).toEqual(['a', 'b', 'c'])
    expect(result).not.toBe(favoriteIds)
  })

  it('returns a new array even if the apartment ID is already present', () => {
    const favoriteIds = ['a', 'b', 'c']
    const apartmentId = 'b'

    const result = addFavoriteApartment(favoriteIds, apartmentId)

    expect(result).toEqual(['a', 'b', 'c'])
    expect(result).not.toBe(favoriteIds) // Ensure it's a new array
  })

  it('returns a new array even if the favorites array is empty', () => {
    const favoriteIds = []
    const apartmentId = 'a'

    const result = addFavoriteApartment(favoriteIds, apartmentId)
    expect(result).toEqual(['a'])
    expect(result).not.toBe(favoriteIds) // Ensure it's a new array
  })
})
