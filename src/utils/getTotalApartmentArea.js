export const getTotalApartmentArea = (apartments) => {
  return apartments.reduce((total, apartment) => {
    if (!Number.isFinite(apartment.area) || apartment.area <= 0) {
      return total
    }

    return total + apartment.area
  }, 0)
}
