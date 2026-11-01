import { apartmentStatuses } from '../constants/apartmentStatuses'

export const countApartmentsByStatus = (apartments = []) => {
  const counts = Object.fromEntries(Object.keys(apartmentStatuses).map((status) => [status, 0]))

  apartments.forEach(({ status }) => {
    counts[status] = (counts[status] ?? 0) + 1
  })

  return counts
}
