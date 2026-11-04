const apartmentStatusOrder = {
  available: 0,
  reserved: 1,
  sold: 2,
}

export const sortApartmentsByStatus = (apartments) => {
  return [...apartments].sort((a, b) => {
    return apartmentStatusOrder[a.status] - apartmentStatusOrder[b.status]
  })
}

export const getAdjacentApartments = (apartments, currentId) => {
  const index = apartments.findIndex((apartment) => apartment.id === currentId)

  if (index === -1) {
    return { previous: null, next: null }
  }

  return {
    previous: apartments[index - 1] ?? null,
    next: apartments[index + 1] ?? null,
  }
}

export const sortApartmentsByPriceAsc = (apartments) => {
  return [...apartments].sort((a, b) => a.price - b.price)
}

export const sortApartmentsByPriceDesc = (apartments) => {
  return [...apartments].sort((a, b) => b.price - a.price)
}

export const sortApartmentsByArea = (apartments) => {
  return [...apartments].sort((a, b) => a.area - b.area)
}
