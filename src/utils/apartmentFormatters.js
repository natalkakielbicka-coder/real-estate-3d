export const getRoomsLabel = (rooms) => {
  if (rooms === 1) {
    return '1 pokój'
  }

  if (rooms >= 2 && rooms <= 4) {
    return `${rooms} pokoje`
  }

  return `${rooms} pokoi`
}

export const getApartmentsCountLabel = (count) => {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100

  if (count === 1) {
    return '1 mieszkanie'
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${count} mieszkania`
  }

  return `${count} mieszkań`
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatFloorLabel = (floorNumber) => {
  return floorNumber === 0 ? 'Parter' : `Piętro ${floorNumber}`
}

export const formatPricePerSquareMeter = (price, area) => {
  if (!Number.isFinite(price) || !Number.isFinite(area) || area <= 0) {
    return '—'
  }

  return `${formatPrice(price / area)}/m²`
}
