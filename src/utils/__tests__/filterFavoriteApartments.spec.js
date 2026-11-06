import { describe, expect, it } from 'vitest'
import { filterFavoriteApartments } from '../filterFavoriteApartments'

describe('filterFavoriteApartments', () => {
  it('should filter apartments based on favorite IDs', () => {
    const apartments = [
      { id: 1, name: 'Apartment 1' },
      { id: 2, name: 'Apartment 2' },
      { id: 3, name: 'Apartment 3' },
    ]
    const favoriteIds = [1, 3]

    const filteredApartments = filterFavoriteApartments(apartments, favoriteIds)

    expect(filteredApartments).toEqual([
      { id: 1, name: 'Apartment 1' },
      { id: 3, name: 'Apartment 3' },
    ])
  })

  it('should return an empty array if no apartments match favorite IDs', () => {
    const apartments = [
      { id: 1, name: 'Apartment 1' },
      { id: 2, name: 'Apartment 2' },
    ]
    const favoriteIds = [3, 4]

    const filteredApartments = filterFavoriteApartments(apartments, favoriteIds)

    expect(filteredApartments).toEqual([])
  })

  it('should return an empty array if apartments array is empty', () => {
    const apartments = []
    const favoriteIds = [1, 2]

    const filteredApartments = filterFavoriteApartments(apartments, favoriteIds)

    expect(filteredApartments).toEqual([])
  })

  it('should return an empty array if favorite IDs are empty', () => {
    const apartments = [
      { id: 1, name: 'Apartment 1' },
      { id: 2, name: 'Apartment 2' },
    ]
    const favoriteIds = []

    const filteredApartments = filterFavoriteApartments(apartments, favoriteIds)

    expect(filteredApartments).toEqual([])
  })

  it('should return only one matching favorite apartment', () => {
    const apartments = [
      { id: 1, name: 'Apartment 1' },
      { id: 2, name: 'Apartment 2' },
      { id: 3, name: 'Apartment 3' },
    ]
    const favoriteIds = [2]

    const filteredApartments = filterFavoriteApartments(apartments, favoriteIds)

    expect(filteredApartments).toEqual([{ id: 2, name: 'Apartment 2' }])
  })

  it('should preserve the original apartment order', () => {
    const apartments = [
      { id: 1, name: 'Apartment 1' },
      { id: 2, name: 'Apartment 2' },
      { id: 3, name: 'Apartment 3' },
    ]
    const favoriteIds = [3, 1]

    const filteredApartments = filterFavoriteApartments(apartments, favoriteIds)

    expect(filteredApartments).toEqual([
      { id: 1, name: 'Apartment 1' },
      { id: 3, name: 'Apartment 3' },
    ])
  })

  it('should not mutate the original apartments array', () => {
    const apartments = [
      { id: 1, name: 'Apartment 1' },
      { id: 2, name: 'Apartment 2' },
      { id: 3, name: 'Apartment 3' },
    ]
    const favoriteIds = [1, 3]
    const originalApartments = [...apartments]

    const filteredApartments = filterFavoriteApartments(apartments, favoriteIds)

    expect(apartments).toEqual(originalApartments)
    expect(filteredApartments).not.toBe(apartments)
    expect(filteredApartments).toEqual([
      { id: 1, name: 'Apartment 1' },
      { id: 3, name: 'Apartment 3' },
    ])
  })
})
