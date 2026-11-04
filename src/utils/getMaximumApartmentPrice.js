export const getMaximumApartmentPrice = (apartments) => {
  const prices = apartments
    .filter((apartment) => Number.isFinite(apartment.price) && apartment.price >= 0)
    .map((apartment) => apartment.price)

  if (prices.length === 0) {
    return null
  }
  return Math.max(...prices)
}
