export const getMaxPriceError = (price) => {
  if (price === null || price === '') {
    return ''
  }

  if (!Number.isFinite(price) || price < 0) {
    return 'Podaj poprawną cenę, nie mniejszą niż 0.'
  }

  return ''
}
