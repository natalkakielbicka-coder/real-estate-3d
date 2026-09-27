export const getApartmentOpacity = ({
  isSelected,
  hasSelectedApartment,
  matchesSearch,
  unmatchedOpacity,
  unselectedOpacity,
}) => {
  let opacity = matchesSearch ? 1 : unmatchedOpacity

  if (hasSelectedApartment) {
    opacity = isSelected ? 1 : Math.min(opacity, unselectedOpacity)
  }

  return opacity
}
