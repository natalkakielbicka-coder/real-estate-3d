<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { buildings } from '../../data/buildings'

const sceneContainer = ref(null)
const emit = defineEmits(['floor-selected'])

let scene
let camera
let renderer
let controls
let building
let ground
let animationFrameId
let hoveredFloor = null
let selectedFloor = null
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

const initScene = () => {
  const container = sceneContainer.value

  scene = new THREE.Scene()

  scene.background = new THREE.Color(0x101210)

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)

  camera.position.set(6, 5, 8)

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

  controls.target.set(0, 1.5, 0)

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

const handlePointerMove = (event) => {
  const container = sceneContainer.value
  const rect = container.getBoundingClientRect()

  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1

  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  raycaster.setFromCamera(pointer, camera)

  const intersections = raycaster.intersectObjects(building.children, false)

  if (intersections.length === 0) {
    clearHoveredFloor()
    renderer.domElement.style.cursor = 'default'
    return
  }

  const hoveredObject = intersections[0].object

  if (hoveredObject.userData.type !== 'floor') {
    clearHoveredFloor()
    renderer.domElement.style.cursor = 'default'
    return
  }

  renderer.domElement.style.cursor = 'pointer'

  if (hoveredFloor === hoveredObject) {
    return
  }

  clearHoveredFloor()

  hoveredFloor = hoveredObject

  updateFloorAppearance(hoveredFloor)
}

const handleFloorClick = () => {
  if (!hoveredFloor) {
    return
  }

  const previousSelectedFloor = selectedFloor

  selectedFloor = hoveredFloor

  updateFloorAppearance(previousSelectedFloor)
  updateFloorAppearance(selectedFloor)

  emit('floor-selected', selectedFloor.userData)
}

const createBuilding = () => {
  building = new THREE.Group()

  const buildingData = buildings[0]

  const floorCount = buildingData.floors.length
  const floorHeight = 0.7
  const floorGap = 0.06
  const buildingWidth = 3.6
  const buildingDepth = 2.4

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

  renderer.domElement.addEventListener('click', handleFloorClick)

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
    renderer.domElement.removeEventListener('pointermove', handlePointerMove)

    renderer.domElement.removeEventListener('click', handleFloorClick)

    renderer.dispose()
    renderer.domElement.remove()
  }
})
</script>

<template>
  <div ref="sceneContainer" class="three-scene"></div>
</template>

<style scoped>
.three-scene {
  width: 100%;
  height: 100vh;
}

.three-scene :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
