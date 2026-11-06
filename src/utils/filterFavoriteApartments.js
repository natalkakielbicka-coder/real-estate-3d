export const filterFavoriteApartments = (apartments, favoriteIds) => {
  return apartments.filter((apartment) => favoriteIds.includes(apartment.id))
}
