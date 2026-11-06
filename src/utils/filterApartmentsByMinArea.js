export const filterApartmentsByMinArea = (apartments, minArea) => {
  if (
    minArea === null ||
    minArea === undefined ||
    minArea === '' ||
    !Number.isFinite(Number(minArea)) ||
    Number(minArea) <= 0
  ) {
    return [...apartments]
  }

  return apartments.filter(
    (apartment) => Number.isFinite(apartment.area) && apartment.area >= Number(minArea),
  )
}
