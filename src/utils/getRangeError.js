const hasInvalidRange = (min, max) => {
  if (min === '' || min == null || max === '' || max == null) {
    return false
  }

  return Number(min) > Number(max)
}

export const getRangeError = ({ minArea, maxArea, minPrice, maxPrice }) => {
  if (hasInvalidRange(minArea, maxArea)) {
    return 'Minimalna powierzchnia nie może być większa od maksymalnej.'
  }

  if (hasInvalidRange(minPrice, maxPrice)) {
    return 'Minimalna cena nie może być większa od maksymalnej.'
  }

  return ''
}
