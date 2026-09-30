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

    const previousSelectedFloor = getSelectedFloor()

    if (previousSelectedFloor === floor) {
      return
    }

    if (getSelectedApartment()) {
      clearSelectedApartment()
    }

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
