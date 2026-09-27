import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export const createThreeSceneCore = ({
  container,
  defaultCameraPosition,
  defaultControlsTarget,
}) => {
  const scene = new THREE.Scene()

  scene.background = new THREE.Color(0xf4f1e9)

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100,
  )

  camera.position.copy(defaultCameraPosition)

  camera.lookAt(0, 1.8, 0)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  renderer.setSize(container.clientWidth, container.clientHeight)

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)

  controls.enableDamping = true
  controls.dampingFactor = 0.05

  controls.minDistance = 5
  controls.maxDistance = 14

  controls.target.copy(defaultControlsTarget)

  controls.update()

  return {
    scene,
    camera,
    renderer,
    controls,
  }
}
