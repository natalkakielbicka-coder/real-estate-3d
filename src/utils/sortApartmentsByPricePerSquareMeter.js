import { getApartmentPricePerSquareMeter } from './getApartmentPricePerSquareMeter'

export const sortApartmentsByPricePerSquareMeter = (apartments) => {
  return [...apartments].sort((a, b) => {
    const priceA = getApartmentPricePerSquareMeter(a) ?? Infinity
    const priceB = getApartmentPricePerSquareMeter(b) ?? Infinity

    return priceA - priceB
  })
}
