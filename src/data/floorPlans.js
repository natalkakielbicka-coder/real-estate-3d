export const floorPlans = {
  studio: [
    { id: 'living-room', name: 'Pokój dzienny', ratio: 0.55 },
    { id: 'kitchen', name: 'Aneks kuchenny', ratio: 0.2 },
    { id: 'bathroom', name: 'Łazienka', ratio: 0.15 },
    { id: 'hall', name: 'Przedpokój', ratio: 0.1 },
  ],

  twoRooms: [
    { id: 'living-room', name: 'Salon z aneksem', ratio: 0.4 },
    { id: 'bedroom', name: 'Sypialnia', ratio: 0.3 },
    { id: 'bathroom', name: 'Łazienka', ratio: 0.15 },
    { id: 'hall', name: 'Przedpokój', ratio: 0.15 },
  ],

  threeRooms: [
    { id: 'living-room', name: 'Salon z aneksem', ratio: 0.35 },
    { id: 'bedroom', name: 'Sypialnia', ratio: 0.25 },
    { id: 'second-bedroom', name: 'Pokój', ratio: 0.2 },
    { id: 'bathroom', name: 'Łazienka', ratio: 0.1 },
    { id: 'hall', name: 'Przedpokój', ratio: 0.1 },
  ],
}

export const getFloorPlanType = (rooms) => {
  if (rooms === 1) return 'studio'
  if (rooms === 2) return 'twoRooms'
  return 'threeRooms'
}

export const getApartmentRooms = (apartment) => {
  const planType = getFloorPlanType(apartment.rooms)
  const plan = floorPlans[planType]

  return plan.map((room, index) => {
    const isLastRoom = index === plan.length - 1

    const area = isLastRoom
      ? Number(
          (
            apartment.area -
            plan
              .slice(0, -1)
              .reduce((sum, item) => sum + Math.round(apartment.area * item.ratio * 100) / 100, 0)
          ).toFixed(2),
        )
      : Math.round(apartment.area * room.ratio * 100) / 100

    return {
      id: room.id,
      name: room.name,
      area,
    }
  })
}
