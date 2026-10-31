export const filterApartments = (apartments, filters = {}) => {
  const {
    rooms = [],
    statuses = [],
    minArea = '',
    maxArea = '',
    minPrice = '',
    maxPrice = '',
  } = filters

  return apartments.filter((apartment) => {
    const matchesRooms =
      rooms.length === 0 || rooms.includes(apartment.rooms >= 4 ? 4 : apartment.rooms)

    const matchesStatus = statuses.length === 0 || statuses.includes(apartment.status)

    const matchesMinArea = minArea === '' || minArea == null || apartment.area >= Number(minArea)

    const matchesMaxArea = maxArea === '' || maxArea == null || apartment.area <= Number(maxArea)

    const matchesMinPrice =
      minPrice === '' || minPrice == null || apartment.price >= Number(minPrice)

    const matchesMaxPrice =
      maxPrice === '' || maxPrice == null || apartment.price <= Number(maxPrice)

    return (
      matchesRooms &&
      matchesStatus &&
      matchesMinArea &&
      matchesMaxArea &&
      matchesMinPrice &&
      matchesMaxPrice
    )
  })
}
