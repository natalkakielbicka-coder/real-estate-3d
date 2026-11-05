import { describe, expect, it } from 'vitest'
import { isFavoriteApartment } from '../isFavoriteApartment'

describe('isFavoriteApartment', () => {
  it('returns true if the apartment ID is in the favorite IDs', () => {
    const favoriteIds = ['a', 'b', 'c']
    const apartmentId = 'b'

    expect(isFavoriteApartment(favoriteIds, apartmentId)).toBe(true)
  })

  it('returns false if the apartment ID is not in the favorite IDs', () => {
    const favoriteIds = ['a', 'b', 'c']
    const apartmentId = 'd'

    expect(isFavoriteApartment(favoriteIds, apartmentId)).toBe(false)
  })

  it('returns false if the favorite IDs array is empty', () => {
    const favoriteIds = []
    const apartmentId = 'a'

    expect(isFavoriteApartment(favoriteIds, apartmentId)).toBe(false)
  })
})
