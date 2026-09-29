export const useFloorSelection = ({
  getBuilding,
  getSelectedFloor,
  setSelectedFloor,
  getSelectedApartment,
  clearSelectedApartment,
  showApartmentsForFloor,
  updateFloorAppearance,
  emitFloorSelected,
}) => {
  const selectFloorMesh = (floor) => {
    if (!floor) {
      return
    }

    if (getSelectedApartment()) {
      clearSelectedApartment()
    }

    const previousSelectedFloor = getSelectedFloor()

    setSelectedFloor(floor)

    showApartmentsForFloor(floor)

    updateFloorAppearance(previousSelectedFloor)
    updateFloorAppearance(floor)

    emitFloorSelected(floor.userData)
  }

  const selectFloorByNumber = (floorNumber) => {
    const building = getBuilding()

    if (!building) {
      return
    }

    const floor = building.children.find(
      (child) => child.userData.type === 'floor' && child.userData.floorNumber === floorNumber,
    )

    selectFloorMesh(floor)
  }

  return {
    selectFloorMesh,
    selectFloorByNumber,
  }
}
