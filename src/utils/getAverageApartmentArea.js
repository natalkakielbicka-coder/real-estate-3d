export const getAverageApartmentArea = (apartments) => {
  const validApartments = apartments.filter(
    (apartment) => Number.isFinite(apartment.area) && apartment.area > 0,
  )

  if (validApartments.length === 0) {
    return 0
  }

  const totalArea = validApartments.reduce((sum, apartment) => sum + apartment.area, 0)

  return totalArea / validApartments.length
}
