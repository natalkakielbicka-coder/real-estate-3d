export const getRoomsLabel = (rooms) => {
  if (rooms === 1) {
    return '1 pokój'
  }

  if (rooms >= 2 && rooms <= 4) {
    return `${rooms} pokoje`
  }

  return `${rooms} pokoi`
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  }).format(price)
}
