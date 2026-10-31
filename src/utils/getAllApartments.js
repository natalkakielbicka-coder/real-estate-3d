export const getAllApartments = (buildings) => {
  return buildings.flatMap((building) =>
    building.floors.flatMap((floor) =>
      floor.apartments.map((apartment) => ({
        ...apartment,
        floorNumber: floor.floorNumber,
        buildingId: building.id,
        buildingName: building.name,
      })),
    ),
  )
}
