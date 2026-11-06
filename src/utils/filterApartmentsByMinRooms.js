export const filterApartmentsByMinRooms = (apartments, minRooms) => {
  if (
    minRooms === null ||
    minRooms === '' ||
    minRooms === undefined ||
    !Number.isInteger(Number(minRooms)) ||
    Number(minRooms) <= 0
  ) {
    return [...apartments]
  }

  return apartments.filter(
    (apartment) => Number.isInteger(apartment.rooms) && apartment.rooms >= Number(minRooms),
  )
}
