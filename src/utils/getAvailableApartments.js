export const getAvailableApartments = (apartments) => {
  return apartments.filter((apartment) => apartment.status === 'available')
}
