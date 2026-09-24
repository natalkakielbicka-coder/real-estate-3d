<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { buildings } from '../../data/buildings'
import { getRoomsLabel } from '../../utils/apartmentFormatters'

const sceneContainer = ref(null)
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  type: '',
  title: '',
  status: '',
  area: '',
  floor: '',
  rooms: '',
  description: '',
})
const emit = defineEmits(['floor-selected', 'apartment-selected'])

let scene
let camera
let renderer
let controls
let building
let ground
let animationFrameId
let hoveredFloor = null
let hoveredApartment = null
let selectedFloor = null
let selectedApartmentMesh = null
let apartmentPreview = null
let apartmentPreviewFloor = null
let isPointerDown = false
let pointerDragged = false
let pointerDownX = 0
let pointerDownY = 0
let cameraTargetPosition = null
let controlsTargetPosition = null
let cameraPositionBeforeApartment = null
let controlsTargetBeforeApartment = null
const dragThreshold = 6
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
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

  scene = new THREE.Scene()

  scene.background = new THREE.Color(0x101210)

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)

  camera.position.copy(defaultCameraPosition)

  // Kamera patrzy na punkt w pobliżu środka wysokości budynku.
  camera.lookAt(0, 1.8, 0)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  renderer.setSize(container.clientWidth, container.clientHeight)

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)

  controls.enableDamping = true

  controls.dampingFactor = 0.05

  controls.minDistance = 5
  controls.maxDistance = 14

  controls.target.copy(defaultControlsTarget)

  controls.update()
}

const createGround = () => {
  const geometry = new THREE.PlaneGeometry(20, 20)

  const material = new THREE.MeshStandardMaterial({
    color: 0x1a1d1a,
    roughness: 1,
  })

  ground = new THREE.Mesh(geometry, material)

  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.01

  scene.add(ground)
}

const updateFloorAppearance = (floor) => {
  if (!floor) {
    return
  }

  if (floor === selectedFloor) {
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

const clearHoveredApartment = () => {
  if (!hoveredApartment) {
    return
  }

  if (hoveredApartment === selectedApartmentMesh) {
    hoveredApartment.material.emissive.set(0x40382f)
  } else {
    hoveredApartment.material.emissive.set(0x000000)
  }

  hoveredApartment = null
}

const clearApartmentPreview = () => {
  clearHoveredApartment()

  if (apartmentPreviewFloor) {
    apartmentPreviewFloor.visible = true
  }

  if (apartmentPreview) {
    apartmentPreview.traverse((object) => {
      if (!object.isMesh) {
        return
      }

      object.geometry.dispose()
      object.material.dispose()
    })

    building.remove(apartmentPreview)
  }

  apartmentPreview = null
  apartmentPreviewFloor = null
  selectedApartmentMesh = null
}

const restoreCameraBeforeApartment = () => {
  if (!cameraPositionBeforeApartment || !controlsTargetBeforeApartment) {
    return
  }

  cameraTargetPosition = cameraPositionBeforeApartment.clone()
  controlsTargetPosition = controlsTargetBeforeApartment.clone()

  cameraPositionBeforeApartment = null
  controlsTargetBeforeApartment = null
}

const clearSelectedApartment = () => {
  if (!selectedApartmentMesh) {
    return
  }

  restoreCameraBeforeApartment()

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

  apartmentPreview = new THREE.Group()
  apartmentPreview.name = 'apartment-preview'

  apartmentPreviewFloor = floor

  floor.visible = false

  const columns = apartments.length <= 4 ? 2 : 3
  const rows = Math.ceil(apartments.length / columns)

  const gap = 0.08

  const apartmentWidth = (buildingWidth - gap * (columns + 1)) / columns

  const apartmentDepth = (buildingDepth - gap * (rows + 1)) / rows

  apartments.forEach((apartment, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)

    const geometry = new THREE.BoxGeometry(apartmentWidth, floorHeight, apartmentDepth)

    const material = new THREE.MeshStandardMaterial({
      color: apartmentStatusColors[apartment.status] ?? 0x777777,
      roughness: 0.7,
      transparent: true,
      opacity: 1,
      emissiveIntensity: 0,
    })

    const apartmentMesh = new THREE.Mesh(geometry, material)

    const targetX = -buildingWidth / 2 + gap + apartmentWidth / 2 + column * (apartmentWidth + gap)

    const targetZ = -buildingDepth / 2 + gap + apartmentDepth / 2 + row * (apartmentDepth + gap)

    apartmentMesh.position.set(0, floor.position.y, 0)

    apartmentMesh.scale.set(0.82, 0.82, 0.82)

    apartmentMesh.userData = {
      type: 'apartment',
      ...apartment,
      targetX,
      targetZ,
      baseY: floor.position.y,
      animationProgress: 0,
      animationDelay: index * 0.06,
    }

    apartmentPreview.add(apartmentMesh)
  })

  building.add(apartmentPreview)
}

const clearSelectedFloor = () => {
  if (!selectedFloor) {
    return
  }

  const previousSelectedFloor = selectedFloor

  clearApartmentPreview()

  cameraPositionBeforeApartment = null
  controlsTargetBeforeApartment = null

  selectedFloor = null

  updateFloorAppearance(previousSelectedFloor)

  cameraTargetPosition = defaultCameraPosition.clone()
  controlsTargetPosition = defaultControlsTarget.clone()
}

const resetView = () => {
  clearApartmentPreview()

  if (selectedFloor) {
    const previousSelectedFloor = selectedFloor

    selectedFloor = null

    updateFloorAppearance(previousSelectedFloor)
  }

  selectedApartmentMesh = null

  cameraPositionBeforeApartment = null
  controlsTargetBeforeApartment = null

  cameraTargetPosition = defaultCameraPosition.clone()
  controlsTargetPosition = defaultControlsTarget.clone()
}

const updateApartmentsSelection = () => {
  if (!apartmentPreview) {
    return
  }

  apartmentPreview.children.forEach((apartmentMesh) => {
    const isSelected = apartmentMesh === selectedApartmentMesh

    apartmentMesh.material.opacity = selectedApartmentMesh ? (isSelected ? 1 : 0.4) : 1

    if (isSelected) {
      apartmentMesh.material.emissive.set(0x5a4936)
      apartmentMesh.material.emissiveIntensity = 0.8
    } else {
      apartmentMesh.material.emissiveIntensity = 0

      if (apartmentMesh !== hoveredApartment) {
        apartmentMesh.material.emissive.set(0x000000)
      }
    }
  })
}

const selectApartmentMesh = (apartmentMesh) => {
  if (!apartmentMesh) {
    return
  }

  if (!selectedApartmentMesh) {
    cameraPositionBeforeApartment = camera.position.clone()
    controlsTargetBeforeApartment = controls.target.clone()
  }

  selectedApartmentMesh = apartmentMesh

  const apartmentTarget = apartmentMesh.position.clone()

  const direction = cameraPositionBeforeApartment
    .clone()
    .sub(controlsTargetBeforeApartment)
    .normalize()

  cameraTargetPosition = apartmentTarget.clone().add(direction.multiplyScalar(9.5))
  controlsTargetPosition = apartmentTarget

  updateApartmentsSelection()
}

const selectApartmentById = (apartmentId) => {
  if (!apartmentPreview) {
    return
  }

  const apartmentMesh = apartmentPreview.children.find((mesh) => mesh.userData.id === apartmentId)

  selectApartmentMesh(apartmentMesh)
}

defineExpose({
  clearSelectedFloor,
  clearSelectedApartment,
  resetView,
  selectApartmentById,
})

const handlePointerMove = (event) => {
  if (isPointerDown) {
    const distance = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY)

    if (distance > dragThreshold) {
      pointerDragged = true
      hideTooltip()
    }
  }

  const container = sceneContainer.value
  const rect = container.getBoundingClientRect()

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1

  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(pointer, camera)

  const intersections = raycaster.intersectObjects(building.children, true)

  if (intersections.length === 0) {
    clearHoveredFloor()
    clearHoveredApartment()
    hideTooltip()

    renderer.domElement.style.cursor = 'default'

    return
  }

  const interactiveIntersection = intersections.find((intersection) => {
    const object = intersection.object
    const type = object.userData.type

    return object.visible && (type === 'apartment' || type === 'floor')
  })

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

    if (hoveredApartment !== hoveredObject) {
      clearHoveredApartment()

      hoveredApartment = hoveredObject

      hoveredApartment.material.emissive.set(0x303630)
    }

    showTooltip(hoveredObject, event, rect)

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

  showTooltip(hoveredObject, event, rect)

  if (hoveredFloor === hoveredObject) {
    return
  }

  clearHoveredFloor()

  hoveredFloor = hoveredObject

  updateFloorAppearance(hoveredFloor)
}

const hideTooltip = () => {
  tooltip.value.visible = false
}

const showTooltip = (object, event, rect) => {
  tooltip.value.x = event.clientX - rect.left - 72
  tooltip.value.y = event.clientY - rect.top

  if (object.userData.type === 'apartment') {
    tooltip.value.type = 'apartment'
    tooltip.value.title = object.userData.number
    tooltip.value.status = object.userData.status
    tooltip.value.area = `${object.userData.area} m²`
    tooltip.value.floor =
      selectedFloor?.userData.floorNumber === 0 ? 'Parter' : selectedFloor?.userData.floorNumber

    tooltip.value.rooms = getRoomsLabel(object.userData.rooms)
  }

  if (object.userData.type === 'floor') {
    tooltip.value.title =
      object.userData.floorNumber === 0 ? 'Parter' : `Piętro ${object.userData.floorNumber}`

    tooltip.value.description = `${object.userData.availableApartments} z ${object.userData.apartmentCount} dostępnych`
    tooltip.value.type = 'floor'
  }

  tooltip.value.visible = true
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

  const container = sceneContainer.value
  const rect = container.getBoundingClientRect()

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(pointer, camera)

  const intersections = raycaster.intersectObjects(building.children, true)

  const interactiveIntersection = intersections.find((intersection) => {
    const object = intersection.object
    const type = object.userData.type

    return object.visible && (type === 'apartment' || type === 'floor')
  })

  if (!interactiveIntersection) {
    return
  }

  const clickedObject = interactiveIntersection.object

  // Kliknięcie mieszkania
  if (clickedObject.userData.type === 'apartment') {
    selectApartmentMesh(clickedObject)

    emit('apartment-selected', clickedObject.userData)

    return
  }

  // Kliknięcie piętra
  if (clickedObject.userData.type === 'floor') {
    if (selectedApartmentMesh) {
      restoreCameraBeforeApartment()
    }

    const previousSelectedFloor = selectedFloor

    selectedFloor = clickedObject

    showApartmentsForFloor(selectedFloor)

    updateFloorAppearance(previousSelectedFloor)
    updateFloorAppearance(selectedFloor)

    emit('floor-selected', selectedFloor.userData)
  }
}

const createBuilding = () => {
  building = new THREE.Group()

  const buildingData = buildings[0]

  const floorCount = buildingData.floors.length

  for (let i = 0; i < floorCount; i += 1) {
    const floorData = buildingData.floors[i]
    const geometry = new THREE.BoxGeometry(buildingWidth, floorHeight, buildingDepth)

    const material = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0xb8beb9 : 0xaeb5b0,
      roughness: 0.75,
    })

    const floor = new THREE.Mesh(geometry, material)

    floor.name = `floor-${i}`

    floor.userData = {
      type: 'floor',
      buildingId: buildingData.id,
      buildingName: buildingData.name,
      ...floorData,
      apartmentCount: floorData.apartments.length,
      availableApartments: floorData.apartments.filter(
        (apartment) => apartment.status === 'available',
      ).length,
    }

    floor.position.y = floorHeight / 2 + i * (floorHeight + floorGap)

    building.add(floor)
  }

  const roofGeometry = new THREE.BoxGeometry(buildingWidth + 0.12, 0.16, buildingDepth + 0.12)

  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x555d57,
    roughness: 0.9,
  })

  const roof = new THREE.Mesh(roofGeometry, roofMaterial)

  roof.position.y = floorCount * (floorHeight + floorGap) + 0.02

  building.add(roof)

  scene.add(building)
}

const createLights = () => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)

  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3)

  directionalLight.position.set(5, 8, 5)

  scene.add(directionalLight)
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  controls.update()

  if (cameraTargetPosition && controlsTargetPosition) {
    camera.position.lerp(cameraTargetPosition, 0.055)

    controls.target.lerp(controlsTargetPosition, 0.055)

    const cameraFinished = camera.position.distanceTo(cameraTargetPosition) < 0.02

    const targetFinished = controls.target.distanceTo(controlsTargetPosition) < 0.02

    if (cameraFinished && targetFinished) {
      camera.position.copy(cameraTargetPosition)
      controls.target.copy(controlsTargetPosition)

      cameraTargetPosition = null
      controlsTargetPosition = null
    }
  }

  if (apartmentPreview) {
    apartmentPreview.children.forEach((apartmentMesh) => {
      if (apartmentMesh.userData.animationProgress < 1) {
        apartmentMesh.userData.animationProgress += 0.045
      }

      const rawProgress =
        apartmentMesh.userData.animationProgress - apartmentMesh.userData.animationDelay

      const progress = THREE.MathUtils.clamp(rawProgress, 0, 1)

      const easedProgress = 1 - Math.pow(1 - progress, 3)

      apartmentMesh.position.x = THREE.MathUtils.lerp(
        0,
        apartmentMesh.userData.targetX,
        easedProgress,
      )

      apartmentMesh.position.z = THREE.MathUtils.lerp(
        0,
        apartmentMesh.userData.targetZ,
        easedProgress,
      )

      const revealScale = THREE.MathUtils.lerp(0.82, 1, easedProgress)

      const selectionScale = apartmentMesh === selectedApartmentMesh ? 1.03 : 1

      const finalScale = revealScale * selectionScale

      apartmentMesh.scale.set(finalScale, finalScale, finalScale)
    })
  }

  renderer.render(scene, camera)
}

const handleResize = () => {
  const container = sceneContainer.value

  if (!container || !camera || !renderer) {
    return
  }

  camera.aspect = container.clientWidth / container.clientHeight

  camera.updateProjectionMatrix()

  renderer.setSize(container.clientWidth, container.clientHeight, false)
}

onMounted(() => {
  initScene()
  createGround()
  createBuilding()
  createLights()
  animate()

  renderer.domElement.addEventListener('pointermove', handlePointerMove)

  renderer.domElement.addEventListener('click', handleSceneClick)

  renderer.domElement.addEventListener('pointerdown', handlePointerDown)

  renderer.domElement.addEventListener('pointerup', handlePointerUp)

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)

  window.removeEventListener('resize', handleResize)

  controls?.dispose()

  building?.traverse((object) => {
    if (!object.isMesh) {
      return
    }

    object.geometry.dispose()
    object.material.dispose()
  })

  if (ground) {
    ground.geometry.dispose()
    ground.material.dispose()
  }

  if (renderer) {
    renderer.domElement.removeEventListener('pointerdown', handlePointerDown)

    renderer.domElement.removeEventListener('pointermove', handlePointerMove)

    renderer.domElement.removeEventListener('pointerup', handlePointerUp)

    renderer.domElement.removeEventListener('click', handleSceneClick)

    renderer.dispose()
    renderer.domElement.remove()
  }
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
  height: 100vh;
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
