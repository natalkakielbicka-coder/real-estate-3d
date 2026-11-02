export const countApartmentsWithBalcony = (apartments) => {
  return apartments.reduce((count, apartment) => {
    if (apartment.balcony === true) {
      return count + 1
    }
    return count
  }, 0)
}
