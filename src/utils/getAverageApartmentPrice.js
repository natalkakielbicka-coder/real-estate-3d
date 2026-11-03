export const getAverageApartmentPrice = (apartments) => {
  if (apartments.length === 0) {
    return 0
  }

  const validApartments = apartments.filter((apartment) => {
    return apartment && Number.isFinite(apartment.price)
  })

  if (validApartments.length === 0) {
    return 0
  }

  const totalPrice = validApartments.reduce((sum, apartment) => {
    return sum + apartment.price
  }, 0)

  return totalPrice / validApartments.length
}
