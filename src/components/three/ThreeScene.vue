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
let isPointerDown = false
let pointerDragged = false
let pointerDownX = 0
let pointerDownY = 0
let startResizeObserver
let stopResizeObserver
let searchMatchedApartmentIds = null
let setCameraTarget
let updateCameraAnimation
let saveCurrentCameraPosition
let restorePreviousCameraPosition
let clearSavedCameraPosition
let getInteractiveIntersection
const dragThreshold = 6
const cameraFocusDistance = 9.5
const cameraAnimationSpeed = 0.055
const cameraAnimationThreshold = 0.02
const unmatchedApartmentOpacity = 0.18
const unselectedApartmentOpacity = 0.4
const apartmentRevealSpeed = 0.045

const floorHeight = 0.7
const floorGap = 0.06
const buildingWidth = 3.6
const buildingDepth = 2.4
const defaultCameraPosition = new THREE.Vector3(6, 5, 8)
const defaultControlsTarget = new THREE.Vector3(0, 1.5, 0)

const apartmentStatusColors = {
  available: 0x6f8f75,
  reserved: 0x9b8050,
  sold: 0x666b67,
}

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
    animationSpeed: cameraAnimationSpeed,
    animationThreshold: cameraAnimationThreshold,
  })

  setCameraTarget = cameraAnimation.setCameraTarget
  updateCameraAnimation = cameraAnimation.updateCameraAnimation
  saveCurrentCameraPosition = cameraAnimation.saveCurrentCameraPosition
  restorePreviousCameraPosition = cameraAnimation.restorePreviousCameraPosition
  clearSavedCameraPosition = cameraAnimation.clearSavedCameraPosition
}

const createGround = () => {
  ground = createGroundMesh({
    buildingWidth,
    buildingDepth,
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
    buildingWidth,
    buildingDepth,
    floorHeight,
    apartmentStatusColors,
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

const updateApartmentsSelection = () => {
  if (!apartmentPreview) {
    return
  }

  apartmentPreview.children.forEach((apartmentMesh) => {
    const isSelected = apartmentMesh === selectedApartmentMesh

    const matchesSearch =
      !searchMatchedApartmentIds || searchMatchedApartmentIds.has(apartmentMesh.userData.id)

    let opacity = matchesSearch ? 1 : unmatchedApartmentOpacity

    if (selectedApartmentMesh) {
      opacity = isSelected ? 1 : Math.min(opacity, unselectedApartmentOpacity)
    }

    apartmentMesh.material.opacity = opacity

    if (isSelected) {
      apartmentMesh.material.emissive.set(0x5a4936)
      apartmentMesh.material.emissiveIntensity = 0.8
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
    .add(direction.multiplyScalar(cameraFocusDistance))

  setCameraTarget(targetCameraPosition, apartmentTarget)

  updateApartmentsSelection()
}

const selectApartmentById = (apartmentId) => {
  if (!apartmentPreview) {
    return
  }

  const apartmentMesh = apartmentPreview.children.find((mesh) => mesh.userData.id === apartmentId)

  selectApartmentMesh(apartmentMesh)
}

const hoverApartmentById = (apartmentId) => {
  if (!apartmentPreview) {
    return
  }

  const apartmentMesh = apartmentPreview.children.find((mesh) => mesh.userData.id === apartmentId)

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
  if (isPointerDown) {
    const distance = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY)

    if (distance > dragThreshold) {
      pointerDragged = true
      hideTooltip()
    }
  }

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

const handlePointerDown = (event) => {
  isPointerDown = true
  pointerDragged = false

  pointerDownX = event.clientX
  pointerDownY = event.clientY
}

const handlePointerUp = () => {
  isPointerDown = false
}

const handleSceneClick = (event) => {
  if (pointerDragged) {
    pointerDragged = false

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
    buildingWidth,
    buildingDepth,
    floorHeight,
    floorGap,
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
    apartmentRevealSpeed,
  })

  renderer.render(scene, camera)
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

  renderer.domElement.addEventListener('pointermove', handlePointerMove)

  renderer.domElement.addEventListener('click', handleSceneClick)

  renderer.domElement.addEventListener('pointerdown', handlePointerDown)

  renderer.domElement.addEventListener('pointerup', handlePointerUp)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)

  stopResizeObserver()

  if (renderer) {
    renderer.domElement.removeEventListener('pointerdown', handlePointerDown)

    renderer.domElement.removeEventListener('pointermove', handlePointerMove)

    renderer.domElement.removeEventListener('pointerup', handlePointerUp)

    renderer.domElement.removeEventListener('click', handleSceneClick)
  }

  disposeThreeScene({
    building,
    ground,
    controls,
    renderer,
  })
})
</script>

<template>
  <div ref="sceneContainer" class="three-scene">
    <div
      v-if="tooltip.visible"
      class="three-scene__tooltip"
      :style="{
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
      }"
    >
      <template v-if="tooltip.type === 'apartment'">
        <div class="three-scene__tooltip-header">
          <strong>
            {{ tooltip.title }}
          </strong>

          <span
            class="three-scene__tooltip-status"
            :class="`three-scene__tooltip-status--${tooltip.status}`"
          ></span>
        </div>

        <span>
          Powierzchnia <strong>{{ tooltip.area }}</strong>
        </span>

        <span>
          Piętro <strong>{{ tooltip.floor }}</strong>
        </span>

        <span>
          Pokoje <strong>{{ tooltip.rooms }}</strong>
        </span>

        <span>
          Cena <strong>{{ tooltip.price }}</strong>
        </span>
      </template>

      <template v-else>
        <strong>
          {{ tooltip.title }}
        </strong>

        <span>
          {{ tooltip.description }}
        </span>
      </template>
    </div>
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

.three-scene__tooltip {
  position: absolute;
  z-index: 30;
  display: grid;
  gap: 2px;
  min-width: 118px;
  padding: 14px 16px;
  pointer-events: none;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translate(-100%, -50%);
  color: #151515;
}

.three-scene__tooltip::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  width: 64px;
  height: 2px;
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-50%);
}

.three-scene__tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: calc(100% + 64px);
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  background: #ffffff;
  transform: translate(-50%, -50%);
}

.three-scene__tooltip-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 6px;
}

.three-scene__tooltip-header strong {
  font-size: 14px;
  font-weight: 700;
}

.three-scene__tooltip > span {
  font-size: 11px;
  line-height: 1.25;
  color: #242424;
}

.three-scene__tooltip > span strong {
  font-weight: 600;
}

.three-scene__tooltip-status {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  border-radius: 50%;
}

.three-scene__tooltip-status--available {
  background: #42a84b;
}

.three-scene__tooltip-status--reserved {
  background: #c59b3d;
}

.three-scene__tooltip-status--sold {
  background: #8a8a8a;
}
</style>
