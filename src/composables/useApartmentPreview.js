import { createApartmentPreview } from '../utils/createApartmentPreview'
import { removeApartmentPreview } from '../utils/removeApartmentPreview'

export const useApartmentPreview = ({
  buildingConfig,
  apartmentStatuses,
  getBuilding,
  clearHoveredApartment,
  updateApartmentsSelection,
}) => {
  let apartmentPreview = null
  let apartmentPreviewFloor = null

  const getApartmentPreview = () => apartmentPreview

  const clearApartmentPreview = () => {
    clearHoveredApartment()

    if (apartmentPreviewFloor) {
      apartmentPreviewFloor.visible = true
    }

    removeApartmentPreview({
      apartmentPreview,
      building: getBuilding(),
    })

    apartmentPreview = null
    apartmentPreviewFloor = null
  }

  const showApartmentsForFloor = (floor, startY = floor.position.y) => {
    clearApartmentPreview()

    const apartments = floor.userData.apartments

    if (!apartments?.length) {
      return
    }

    apartmentPreview = createApartmentPreview({
      floor,
      buildingWidth: buildingConfig.width,
      buildingDepth: buildingConfig.depth,
      floorHeight: buildingConfig.floorHeight,
      apartmentStatuses,
      startY,
    })

    apartmentPreviewFloor = floor

    floor.visible = false

    getBuilding().add(apartmentPreview)

    updateApartmentsSelection()
  }

  return {
    getApartmentPreview,
    clearApartmentPreview,
    showApartmentsForFloor,
  }
}
