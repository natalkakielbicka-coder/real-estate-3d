export const isApartmentWithinBudget = (apartment, maxPrice) => {
  if (!apartment || typeof apartment.price !== 'number') {
    return false
  }
  return apartment.price <= maxPrice
}
