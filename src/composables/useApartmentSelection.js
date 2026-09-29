import { getApartmentOpacity } from '../utils/getApartmentOpacity'

export const useApartmentSelection = ({
  apartmentConfig,
  getApartmentPreview,
  getSelectedApartment,
  isApartmentHovered,
}) => {
  let searchMatchedApartmentIds = null

  const apartmentMatchesSearch = (apartmentId) => {
    return !searchMatchedApartmentIds || searchMatchedApartmentIds.has(apartmentId)
  }

  const updateApartmentsSelection = () => {
    const apartmentPreview = getApartmentPreview()

    if (!apartmentPreview) {
      return
    }

    const selectedApartmentMesh = getSelectedApartment()

    apartmentPreview.children.forEach((apartmentMesh) => {
      const isSelected = apartmentMesh === selectedApartmentMesh
      const matchesSearch = apartmentMatchesSearch(apartmentMesh.userData.id)

      const opacity = getApartmentOpacity({
        isSelected,
        hasSelectedApartment: Boolean(selectedApartmentMesh),
        matchesSearch,
        unmatchedOpacity: apartmentConfig.unmatchedOpacity,
        unselectedOpacity: apartmentConfig.unselectedOpacity,
      })

      apartmentMesh.material.opacity = opacity

      if (isSelected) {
        apartmentMesh.material.emissive.set(apartmentConfig.selectedEmissiveColor)
        apartmentMesh.material.emissiveIntensity = apartmentConfig.selectedEmissiveIntensity
      } else {
        apartmentMesh.material.emissiveIntensity = 0

        if (!isApartmentHovered(apartmentMesh)) {
          apartmentMesh.material.emissive.set(0x000000)
        }
      }
    })
  }

  const setSearchMatches = (apartmentIds) => {
    searchMatchedApartmentIds = new Set(apartmentIds)
    updateApartmentsSelection()
  }

  const clearSearchMatches = () => {
    searchMatchedApartmentIds = null
    updateApartmentsSelection()
  }

  const findApartmentMeshById = (apartmentId) => {
    const apartmentPreview = getApartmentPreview()

    if (!apartmentPreview) {
      return null
    }

    return apartmentPreview.children.find((mesh) => mesh.userData.id === apartmentId)
  }

  return {
    updateApartmentsSelection,
    setSearchMatches,
    clearSearchMatches,
    findApartmentMeshById,
  }
}
