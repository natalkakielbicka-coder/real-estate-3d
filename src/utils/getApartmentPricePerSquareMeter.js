export const getApartmentPricePerSquareMeter = (apartment) => {
  if (!apartment) return null

  const { price, area } = apartment

  if (!Number.isFinite(price) || !Number.isFinite(area) || price < 0 || area <= 0) {
    return null
  }

  return price / area
}
