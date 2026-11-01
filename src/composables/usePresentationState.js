import { ref } from 'vue'

export const usePresentationState = ({ threeScene }) => {
  const selectedFloor = ref(null)
  const selectedApartment = ref(null)
  const panelTransitionDirection = ref('forward')

  const handleFloorSelected = (floorData) => {
    selectedFloor.value = floorData
    selectedApartment.value = null
    panelTransitionDirection.value = 'forward'
  }

  const handleSceneApartmentSelected = (apartment) => {
    panelTransitionDirection.value = 'forward'
    selectedApartment.value = apartment
  }

  const handlePanelApartmentSelected = (apartment) => {
    panelTransitionDirection.value = 'forward'
    selectedApartment.value = apartment

    threeScene.value?.selectApartmentById?.(apartment.id)
  }

  const handleApartmentBack = () => {
    panelTransitionDirection.value = 'backward'
    selectedApartment.value = null

    threeScene.value?.clearSelectedApartment?.()
  }

  const handlePanelClose = () => {
    selectedFloor.value = null
    selectedApartment.value = null

    threeScene.value?.clearSelectedFloor?.()
  }

  const handleResetView = () => {
    selectedFloor.value = null
    selectedApartment.value = null

    threeScene.value?.resetView?.()
  }

  const handleApartmentHover = (apartment) => {
    threeScene.value?.hoverApartmentById?.(apartment.id)
  }

  const handleApartmentHoverEnd = () => {
    threeScene.value?.clearApartmentHover?.()
  }

  const handleFloorSelectorSelect = (floorNumber) => {
    threeScene.value?.selectFloorByNumber?.(floorNumber)
  }

  const handleSearchApartmentSelect = (apartment) => {
    threeScene.value?.selectFloorByNumber?.(apartment.floorNumber)

    selectedApartment.value = apartment

    threeScene.value?.selectApartmentById?.(apartment.id)
  }

  const handleSearchResults = (apartmentIds) => {
    threeScene.value?.setSearchMatches?.(apartmentIds)
  }

  const handleSearchClear = () => {
    threeScene.value?.clearSearchMatches?.()
  }

  return {
    selectedFloor,
    selectedApartment,
    panelTransitionDirection,
    handleFloorSelected,
    handleSceneApartmentSelected,
    handlePanelApartmentSelected,
    handleApartmentBack,
    handlePanelClose,
    handleResetView,
    handleApartmentHover,
    handleApartmentHoverEnd,
    handleFloorSelectorSelect,
    handleSearchApartmentSelect,
    handleSearchResults,
    handleSearchClear,
  }
}
