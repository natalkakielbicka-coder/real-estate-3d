export const apartmentStatuses = {
  available: {
    label: 'Dostępne',
    threeColor: 0x6f8f75,
    cssColor: '#42a84b',
  },
  reserved: {
    label: 'Zarezerwowane',
    threeColor: 0x9b8050,
    cssColor: '#c59b3d',
  },
  sold: {
    label: 'Sprzedane',
    threeColor: 0x666b67,
    cssColor: '#8a8a8a',
  },
}

export const apartmentStatusLabels = Object.fromEntries(
  Object.entries(apartmentStatuses).map(([status, config]) => [status, config.label]),
)
