const getFirstValue = (value) => (Array.isArray(value) ? value[0] : value)

export const parsePresentationQuery = (query = {}) => {
  const floor = getFirstValue(query.floor)
  const apartment = getFirstValue(query.apartment)
  const floorNumber = floor == null || floor === '' ? null : Number(floor)

  return {
    floorNumber: Number.isInteger(floorNumber) ? floorNumber : null,
    apartmentId: apartment ? String(apartment) : null,
  }
}

export const buildPresentationQuery = ({ floor, apartment } = {}) => {
  if (!floor) {
    return {}
  }

  const query = { floor: floor.floorNumber }

  if (apartment) {
    query.apartment = apartment.id
  }

  return query
}
