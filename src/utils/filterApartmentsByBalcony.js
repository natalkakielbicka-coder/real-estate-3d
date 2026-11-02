export const filterApartmentsByBalcony = (apartments) => {
  return apartments.filter((apartment) => {
    return apartment.balcony === true
  })
}
