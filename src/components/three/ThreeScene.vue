<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const sceneContainer = ref(null)

let scene
let camera
let renderer
let cube
let animationFrameId

const initScene = () => {
  const container = sceneContainer.value

  scene = new THREE.Scene()

  scene.background = new THREE.Color(0x101210)

  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)

  camera.position.set(4, 3, 6)

  // Kamera ma patrzeć dokładnie na środek sceny.
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  renderer.setSize(container.clientWidth, container.clientHeight)

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  container.appendChild(renderer.domElement)
}

const createCube = () => {
  const geometry = new THREE.BoxGeometry(2, 2, 2)

  const material = new THREE.MeshStandardMaterial({
    color: 0x8f9a91,
    roughness: 0.6,
  })

  cube = new THREE.Mesh(geometry, material)

  scene.add(cube)
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

  renderer.render(scene, camera)
}

const handleResize = () => {
  const container = sceneContainer.value

  if (!container || !camera || !renderer) {
    return
  }

  camera.aspect = container.clientWidth / container.clientHeight

  camera.updateProjectionMatrix()

  renderer.setSize(container.clientWidth, container.clientHeight)
}

onMounted(() => {
  initScene()
  createCube()
  createLights()
  animate()

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)

  window.removeEventListener('resize', handleResize)

  if (cube) {
    cube.geometry.dispose()
    cube.material.dispose()
  }

  if (renderer) {
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
