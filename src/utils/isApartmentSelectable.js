export const isApartmentSelectable = (apartment) => {
  return Boolean(apartment) && apartment.status !== 'sold'
}
