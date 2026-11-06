export const getApartmentPriceRange = (apartments) => {
  const prices = apartments
    .map((apartment) => apartment.price)
    .filter((price) => Number.isFinite(price) && price >= 0)

  if (prices.length === 0) {
    return {
      min: null,
      max: null,
    }
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}
