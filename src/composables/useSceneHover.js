export const useSceneHover = ({ getSelectedFloor, getSelectedApartment }) => {
  let hoveredFloor = null
  let hoveredApartment = null

  const updateFloorAppearance = (floor) => {
    if (!floor) {
      return
    }

    if (floor === getSelectedFloor()) {
      floor.material.emissive.set(0x75624a)
      return
    }

    if (floor === hoveredFloor) {
      floor.material.emissive.set(0x435047)
      return
    }

    floor.material.emissive.set(0x000000)
  }

  const clearHoveredFloor = () => {
    if (!hoveredFloor) {
      return
    }

    const previousHoveredFloor = hoveredFloor

    hoveredFloor = null

    updateFloorAppearance(previousHoveredFloor)
  }

  const setHoveredFloor = (floor) => {
    if (hoveredFloor === floor) {
      return
    }

    clearHoveredFloor()

    hoveredFloor = floor

    updateFloorAppearance(hoveredFloor)
  }

  const clearHoveredApartment = () => {
    if (!hoveredApartment) {
      return
    }

    if (hoveredApartment === getSelectedApartment()) {
      hoveredApartment.material.emissive.set(0x5a4936)
      hoveredApartment.material.emissiveIntensity = 0.8
    } else {
      hoveredApartment.material.emissive.set(0x000000)
      hoveredApartment.material.emissiveIntensity = 0
    }

    hoveredApartment = null
  }

  const setHoveredApartment = (apartment) => {
    if (hoveredApartment === apartment) {
      return
    }

    clearHoveredApartment()

    hoveredApartment = apartment

    hoveredApartment.material.emissive.set(0x303630)
    hoveredApartment.material.emissiveIntensity = 0.8
  }

  const isApartmentHovered = (apartment) => {
    return hoveredApartment === apartment
  }

  return {
    updateFloorAppearance,
    clearHoveredFloor,
    setHoveredFloor,
    clearHoveredApartment,
    setHoveredApartment,
    isApartmentHovered,
  }
}
