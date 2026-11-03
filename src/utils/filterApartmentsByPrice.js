import { isApartmentWithinBudget } from './isApartmentWithinBudget'

export const filterApartmentsByPrice = (apartments, maxPrice) => {
  return apartments.filter((apartment) => isApartmentWithinBudget(apartment, maxPrice))
}
