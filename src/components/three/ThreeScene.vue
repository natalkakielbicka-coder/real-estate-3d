<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { buildings } from '../../data/buildings'
import { useCameraAnimation } from '../../composables/useCameraAnimation'
import { useRaycastInteraction } from '../../composables/useRaycastInteraction'
import { useSceneTooltip } from '../../composables/useSceneTooltip'
import { useSceneHover } from '../../composables/useSceneHover'
import { createApartmentPreview } from '../../utils/createApartmentPreview'
import { createBuildingMesh } from '../../utils/createBuildingMesh'
import { createGroundMesh } from '../../utils/createGround'
import { createSceneLights } from '../../utils/createSceneLights'
import { createThreeSceneCore } from '../../utils/createThreeSceneCore'
import { useSceneResize } from '../../composables/useSceneResize'
import { updateApartmentPreviewAnimation } from '../../utils/updateApartmentPreviewAnimation'
import { disposeThreeScene } from '../../utils/disposeThreeScene'
import { removeApartmentPreview } from '../../utils/removeApartmentPreview'
import { getApartmentOpacity } from '../../utils/getApartmentOpacity'
import { apartmentStatuses } from '../../constants/apartmentStatuses'
import { usePointerDrag } from '../../composables/usePointerDrag'
import SceneTooltip from './SceneTooltip.vue'
import { sceneConfig } from '../../config/sceneConfig'

const sceneContainer = ref(null)

const { tooltip, showTooltip, hideTooltip } = useSceneTooltip()

const emit = defineEmits(['floor-selected', 'apartment-selected'])

let scene
let camera
let renderer
let controls
let building
let ground
let animationFrameId
let selectedFloor = null
let selectedApartmentMesh = null
const {
  updateFloorAppearance,
  clearHoveredFloor,
  setHoveredFloor,
  clearHoveredApartment,
  setHoveredApartment,
  isApartmentHovered,
} = useSceneHover({
  getSelectedFloor: () => selectedFloor,
  getSelectedApartment: () => selectedApartmentMesh,
})
let apartmentPreview = null
let apartmentPreviewFloor = null
let startResizeObserver
let stopResizeObserver
let searchMatchedApartmentIds = null
let setCameraTarget
let updateCameraAnimation
let saveCurrentCameraPosition
let restorePreviousCameraPosition
let clearSavedCameraPosition
let getInteractiveIntersection

const {
  interaction,
  camera: cameraConfig,
  apartments: apartmentConfig,
  building: buildingConfig,
} = sceneConfig

const {
  handlePointerDown,
  handlePointerMove: trackPointerMove,
  handlePointerUp,
  consumePointerDrag,
} = usePointerDrag({
  dragThreshold: interaction.dragThreshold,
  onDragStart: hideTooltip,
})

const defaultCameraPosition = new THREE.Vector3(6, 5, 8)
const defaultControlsTarget = new THREE.Vector3(0, 1.5, 0)

const initScene = () => {
  const container = sceneContainer.value

  const sceneCore = createThreeSceneCore({
    container,
    defaultCameraPosition,
    defaultControlsTarget,
  })

  scene = sceneCore.scene
  camera = sceneCore.camera
  renderer = sceneCore.renderer
  controls = sceneCore.controls

  const cameraAnimation = useCameraAnimation({
    camera,
    controls,
    animationSpeed: cameraConfig.animationSpeed,
    animationThreshold: cameraConfig.animationThreshold,
  })

  setCameraTarget = cameraAnimation.setCameraTarget
  updateCameraAnimation = cameraAnimation.updateCameraAnimation
  saveCurrentCameraPosition = cameraAnimation.saveCurrentCameraPosition
  restorePreviousCameraPosition = cameraAnimation.restorePreviousCameraPosition
  clearSavedCameraPosition = cameraAnimation.clearSavedCameraPosition
}

const createGround = () => {
  ground = createGroundMesh({
    buildingWidth: buildingConfig.width,
    buildingDepth: buildingConfig.depth,
  })

  scene.add(ground)
}

const clearApartmentPreview = () => {
  clearHoveredApartment()

  if (apartmentPreviewFloor) {
    apartmentPreviewFloor.visible = true
  }

  removeApartmentPreview({
    apartmentPreview,
    building,
  })

  apartmentPreview = null
  apartmentPreviewFloor = null
  selectedApartmentMesh = null
}

const setSearchMatches = (apartmentIds) => {
  searchMatchedApartmentIds = new Set(apartmentIds)

  updateApartmentsSelection()
}

const clearSearchMatches = () => {
  searchMatchedApartmentIds = null

  updateApartmentsSelection()
}

const clearSelectedApartment = () => {
  if (!selectedApartmentMesh) {
    return
  }

  restorePreviousCameraPosition()

  selectedApartmentMesh = null

  updateApartmentsSelection()
}

const showApartmentsForFloor = (floor) => {
  selectedApartmentMesh = null

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
  })

  apartmentPreviewFloor = floor

  floor.visible = false

  building.add(apartmentPreview)

  updateApartmentsSelection()
}

const clearSelectedFloor = () => {
  if (!selectedFloor) {
    return
  }

  const previousSelectedFloor = selectedFloor

  clearApartmentPreview()

  clearSavedCameraPosition()

  selectedFloor = null

  updateFloorAppearance(previousSelectedFloor)

  setCameraTarget(defaultCameraPosition, defaultControlsTarget)
}

const resetView = () => {
  clearApartmentPreview()

  if (selectedFloor) {
    const previousSelectedFloor = selectedFloor

    selectedFloor = null

    updateFloorAppearance(previousSelectedFloor)
  }

  selectedApartmentMesh = null

  clearSavedCameraPosition()

  setCameraTarget(defaultCameraPosition, defaultControlsTarget)
}

const apartmentMatchesSearch = (apartmentId) => {
  return !searchMatchedApartmentIds || searchMatchedApartmentIds.has(apartmentId)
}

const updateApartmentsSelection = () => {
  if (!apartmentPreview) {
    return
  }

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

const selectApartmentMesh = (apartmentMesh) => {
  if (!apartmentMesh || apartmentMesh.userData.status === 'sold') {
    return
  }

  if (!selectedApartmentMesh) {
    saveCurrentCameraPosition()
  }

  selectedApartmentMesh = apartmentMesh

  const apartmentTarget = apartmentMesh.position.clone()

  const direction = camera.position.clone().sub(controls.target).normalize()

  const targetCameraPosition = apartmentTarget
    .clone()
    .add(direction.multiplyScalar(cameraConfig.focusDistance))

  setCameraTarget(targetCameraPosition, apartmentTarget)

  updateApartmentsSelection()
}

const findApartmentMeshById = (apartmentId) => {
  if (!apartmentPreview) {
    return null
  }

  return apartmentPreview.children.find((mesh) => mesh.userData.id === apartmentId)
}

const selectApartmentById = (apartmentId) => {
  const apartmentMesh = findApartmentMeshById(apartmentId)

  selectApartmentMesh(apartmentMesh)
}

const hoverApartmentById = (apartmentId) => {
  const apartmentMesh = findApartmentMeshById(apartmentId)

  if (!apartmentMesh || apartmentMesh.userData.status === 'sold') {
    return
  }

  setHoveredApartment(apartmentMesh)
}

const clearApartmentHover = () => {
  clearHoveredApartment()
}

const selectFloorMesh = (floor) => {
  if (!floor) {
    return
  }

  if (selectedApartmentMesh) {
    restorePreviousCameraPosition()
  }

  const previousSelectedFloor = selectedFloor

  selectedFloor = floor

  showApartmentsForFloor(selectedFloor)

  updateFloorAppearance(previousSelectedFloor)
  updateFloorAppearance(selectedFloor)

  emit('floor-selected', selectedFloor.userData)
}

const selectFloorByNumber = (floorNumber) => {
  if (!building) {
    return
  }

  const floor = building.children.find(
    (child) => child.userData.type === 'floor' && child.userData.floorNumber === floorNumber,
  )

  selectFloorMesh(floor)
}

defineExpose({
  clearSelectedFloor,
  clearSelectedApartment,
  resetView,
  selectApartmentById,
  hoverApartmentById,
  clearApartmentHover,
  selectFloorByNumber,
  setSearchMatches,
  clearSearchMatches,
})

const handlePointerMove = (event) => {
  trackPointerMove(event)

  const { intersection: interactiveIntersection, rect } = getInteractiveIntersection(event)

  if (!interactiveIntersection) {
    clearHoveredFloor()
    clearHoveredApartment()
    hideTooltip()

    renderer.domElement.style.cursor = 'default'

    return
  }

  const hoveredObject = interactiveIntersection.object

  if (hoveredObject.userData.type === 'apartment') {
    clearHoveredFloor()

    if (hoveredObject.userData.status === 'sold') {
      clearHoveredApartment()

      showTooltip(hoveredObject, event, rect, selectedFloor)

      renderer.domElement.style.cursor = 'not-allowed'

      return
    }

    setHoveredApartment(hoveredObject)

    showTooltip(hoveredObject, event, rect, selectedFloor)

    renderer.domElement.style.cursor = 'pointer'

    return
  }

  clearHoveredApartment()

  if (hoveredObject.userData.type !== 'floor') {
    clearHoveredFloor()

    renderer.domElement.style.cursor = 'default'

    return
  }

  renderer.domElement.style.cursor = 'pointer'

  showTooltip(hoveredObject, event, rect, selectedFloor)

  setHoveredFloor(hoveredObject)
}

const handleSceneClick = (event) => {
  if (consumePointerDrag()) {
    return
  }

  const { intersection: interactiveIntersection } = getInteractiveIntersection(event)

  if (!interactiveIntersection) {
    return
  }

  const clickedObject = interactiveIntersection.object

  // Kliknięcie mieszkania
  if (clickedObject.userData.type === 'apartment') {
    if (clickedObject.userData.status === 'sold') {
      return
    }

    selectApartmentMesh(clickedObject)

    emit('apartment-selected', clickedObject.userData)

    return
  }

  // Kliknięcie piętra
  if (clickedObject.userData.type === 'floor') {
    selectFloorMesh(clickedObject)
  }
}

const createBuilding = () => {
  building = createBuildingMesh({
    buildingData: buildings[0],
    buildingWidth: buildingConfig.width,
    buildingDepth: buildingConfig.depth,
    floorHeight: buildingConfig.floorHeight,
    floorGap: buildingConfig.floorGap,
  })

  scene.add(building)
}

const createLights = () => {
  const lights = createSceneLights()

  scene.add(lights)
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  controls.update()

  updateCameraAnimation()

  updateApartmentPreviewAnimation({
    apartmentPreview,
    selectedApartmentMesh,
    apartmentRevealSpeed: apartmentConfig.revealSpeed,
  })

  renderer.render(scene, camera)
}

const addSceneEventListeners = () => {
  renderer.domElement.addEventListener('pointermove', handlePointerMove)
  renderer.domElement.addEventListener('click', handleSceneClick)
  renderer.domElement.addEventListener('pointerdown', handlePointerDown)
  renderer.domElement.addEventListener('pointerup', handlePointerUp)
}

const removeSceneEventListeners = () => {
  if (!renderer) {
    return
  }

  renderer.domElement.removeEventListener('pointermove', handlePointerMove)
  renderer.domElement.removeEventListener('click', handleSceneClick)
  renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
  renderer.domElement.removeEventListener('pointerup', handlePointerUp)
}

onMounted(() => {
  initScene()

  const sceneResize = useSceneResize({
    sceneContainer,
    camera,
    renderer,
    controls,
  })

  startResizeObserver = sceneResize.startResizeObserver
  stopResizeObserver = sceneResize.stopResizeObserver

  createGround()
  createBuilding()

  const raycastInteraction = useRaycastInteraction({
    sceneContainer,
    camera,
    building,
  })

  getInteractiveIntersection = raycastInteraction.getInteractiveIntersection

  createLights()
  animate()

  startResizeObserver()

  addSceneEventListeners()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)

  stopResizeObserver()

  removeSceneEventListeners()

  disposeThreeScene({
    building,
    ground,
    controls,
    renderer,
  })
})
</script>

<template>
  <div
    ref="sceneContainer"
    class="three-scene"
    :style="{
      '--status-available': apartmentStatuses.available.cssColor,
      '--status-reserved': apartmentStatuses.reserved.cssColor,
      '--status-sold': apartmentStatuses.sold.cssColor,
    }"
  >
    <SceneTooltip :tooltip="tooltip" />
  </div>
</template>

<style scoped>
.three-scene {
  position: relative;
  width: 100%;
  height: 100%;
}

.three-scene :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
