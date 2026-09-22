<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const sceneContainer = ref(null)

let scene
let camera
let renderer
let animationFrameId

const initScene = () => {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    45,
    sceneContainer.value.clientWidth / sceneContainer.value.clientHeight,
    0.1,
    100,
  )

  camera.position.set(4, 3, 6)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  renderer.setSize(sceneContainer.value.clientWidth, sceneContainer.value.clientHeight)

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  sceneContainer.value.appendChild(renderer.domElement)
}

const createCube = () => {
  const geometry = new THREE.BoxGeometry(2, 2, 2)

  const material = new THREE.MeshStandardMaterial({
    color: 0x88928a,
  })

  const cube = new THREE.Mesh(geometry, material)

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

onMounted(() => {
  initScene()
  createCube()
  createLights()
  animate()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)

  renderer?.dispose()
})
</script>

<template>
  <div ref="sceneContainer" class="three-scene"></div>
</template>
