import * as THREE from 'three'

export const createSceneLights = () => {
  const group = new THREE.Group()

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)

  group.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xfff9ed, 2.2)

  directionalLight.position.set(6, 9, 7)

  directionalLight.castShadow = true

  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048

  directionalLight.shadow.camera.near = 1
  directionalLight.shadow.camera.far = 25
  directionalLight.shadow.camera.left = -8
  directionalLight.shadow.camera.right = 8
  directionalLight.shadow.camera.top = 8
  directionalLight.shadow.camera.bottom = -8

  directionalLight.shadow.bias = -0.0005

  group.add(directionalLight)

  const fillLight = new THREE.DirectionalLight(0xdde5dc, 0.8)

  fillLight.position.set(-5, 4, -4)

  group.add(fillLight)

  return group
}
