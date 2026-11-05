import { isFavoriteApartment } from './isFavoriteApartment'

export const addFavoriteApartment = (favoriteIds, apartmentId) => {
  if (!isFavoriteApartment(favoriteIds, apartmentId)) {
    return [...favoriteIds, apartmentId]
  }
  return [...favoriteIds]
}
