export const getRoomsLabel = (rooms) => {
  if (rooms === 1) return 'pokój'
  if (rooms >= 2 && rooms <= 4) return 'pokoje'

  return 'pokoi'
}
