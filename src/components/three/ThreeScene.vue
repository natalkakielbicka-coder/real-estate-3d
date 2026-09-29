<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { buildings } from '../../data/buildings'
import { useCameraAnimation } from '../../composables/useCameraAnimation'
import { useRaycastInteraction } from '../../composables/useRaycastInteraction'
import { useSceneTooltip } from '../../composables/useSceneTooltip'
import { useSceneHover } from '../../composables/useSceneHover'
import { createBuildingMesh } from '../../utils/createBuildingMesh'
import { createGroundMesh } from '../../utils/createGround'
import { createSceneLights } from '../../utils/createSceneLights'
import { createThreeSceneCore } from '../../utils/createThreeSceneCore'
import { useSceneResize } from '../../composables/useSceneResize'
import { updateApartmentPreviewAnimation } from '../../utils/updateApartmentPreviewAnimation'
import { disposeThreeScene } from '../../utils/disposeThreeScene'
import { apartmentStatuses } from '../../constants/apartmentStatuses'
import { usePointerDrag } from '../../composables/usePointerDrag'
import { useApartmentSelection } from '../../composables/useApartmentSelection'
import { useApartmentPreview } from '../../composables/useApartmentPreview'
import { useFloorSelection } from '../../composables/useFloorSelection'
import SceneTooltip from './SceneTooltip.vue'
import { sceneConfig } from '../../config/sceneConfig'

const sceneContainer = ref(null)

const { tooltip, showTooltip, hideTooltip } = useSceneTooltip()

const emit = defineEmits(['floor-selected', 'apartment-selected'])

const {
  interaction,
  camera: cameraConfig,
  apartments: apartmentConfig,
  building: buildingConfig,
} = sceneConfig

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

const { updateApartmentsSelection, setSearchMatches, clearSearchMatches, findApartmentMeshById } =
  useApartmentSelection({
    apartmentConfig,
    getApartmentPreview: () => getApartmentPreview(),
    getSelectedApartment: () => selectedApartmentMesh,
    isApartmentHovered,
  })

const apartmentPreviewComposable = useApartmentPreview({
  buildingConfig,
  apartmentStatuses,
  getBuilding: () => building,
  clearHoveredApartment,
  updateApartmentsSelection,
})

getApartmentPreview = apartmentPreviewComposable.getApartmentPreview

const { clearApartmentPreview, showApartmentsForFloor } = apartmentPreviewComposable

let startResizeObserver
let stopResizeObserver
let getApartmentPreview
let setCameraTarget
let updateCameraAnimation
let saveCurrentCameraPosition
let restorePreviousCameraPosition
let clearSavedCameraPosition
let getInteractiveIntersection

const {
  handlePointerDown,
  handlePointerMove: trackPointerMove,
  handlePointerUp,
  consumePointerDrag,
} = usePointerDrag({
  dragThreshold: interaction.dragThreshold,
  onDragStart: hideTooltip,
})

const { defaultPosition, defaultTarget } = cameraConfig

const defaultCameraPosition = new THREE.Vector3(
  defaultPosition.x,
  defaultPosition.y,
  defaultPosition.z,
)

const defaultControlsTarget = new THREE.Vector3(defaultTarget.x, defaultTarget.y, defaultTarget.z)

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

const clearSelectedApartment = () => {
  if (!selectedApartmentMesh) {
    return
  }

  restorePreviousCameraPosition()

  selectedApartmentMesh = null

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

const { selectFloorMesh, selectFloorByNumber } = useFloorSelection({
  getBuilding: () => building,
  getSelectedFloor: () => selectedFloor,
  setSelectedFloor: (floor) => {
    selectedFloor = floor
  },
  getSelectedApartment: () => selectedApartmentMesh,
  clearSelectedApartment,
  showApartmentsForFloor,
  updateFloorAppearance,
  emitFloorSelected: (floorData) => {
    emit('floor-selected', floorData)
  },
})

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
    apartmentPreview: getApartmentPreview(),
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
