const createApartments = (floorNumber, statuses) => {
  return statuses.map((status, index) => {
    const area = 38 + index * 7
    const pricePerSquareMeter = 12500 + floorNumber * 250 + index * 180

    return {
      id: `A-${floorNumber}-${index + 1}`,
      number: `${floorNumber}.${index + 1}`,
      rooms: (index % 3) + 1,
      area,
      price: area * pricePerSquareMeter,
      status,
    }
  })
}

export const buildings = [
  {
    id: 'building-a',
    name: 'Budynek A',
    floors: [
      {
        floorNumber: 0,
        apartments: createApartments(0, ['available', 'reserved', 'available', 'sold']),
      },
      {
        floorNumber: 1,
        apartments: createApartments(1, [
          'available',
          'available',
          'reserved',
          'available',
          'sold',
          'available',
        ]),
      },
      {
        floorNumber: 2,
        apartments: createApartments(2, [
          'available',
          'reserved',
          'available',
          'sold',
          'reserved',
          'available',
        ]),
      },
      {
        floorNumber: 3,
        apartments: createApartments(3, [
          'available',
          'available',
          'available',
          'available',
          'sold',
          'available',
        ]),
      },
      {
        floorNumber: 4,
        apartments: createApartments(4, ['reserved', 'available', 'sold', 'sold']),
      },
    ],
  },
]
