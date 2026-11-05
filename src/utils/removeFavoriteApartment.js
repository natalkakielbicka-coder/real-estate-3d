export const removeFavoriteApartment = (favoriteIds, apartmentId) => {
  return favoriteIds.filter((id) => id !== apartmentId)
}
