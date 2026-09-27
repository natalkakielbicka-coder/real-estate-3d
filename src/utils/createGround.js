import * as THREE from 'three'

export const createGroundMesh = ({ buildingWidth, buildingDepth }) => {
  const group = new THREE.Group()

  const groundGeometry = new THREE.PlaneGeometry(20, 20)

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xcfd8c4,
    roughness: 1,
  })

  const ground = new THREE.Mesh(groundGeometry, groundMaterial)

  ground.receiveShadow = true
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.03

  group.add(ground)

  const platformGeometry = new THREE.BoxGeometry(buildingWidth + 1.4, 0.08, buildingDepth + 1.4)

  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0xcfd8c4,
    roughness: 0.95,
  })

  const platform = new THREE.Mesh(platformGeometry, platformMaterial)

  platform.receiveShadow = true
  platform.castShadow = false
  platform.position.y = 0

  group.add(platform)

  const pathMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8d4ca,
    roughness: 0.95,
  })

  const pathWidth = 0.45
  const pathOffset = 0.7

  const frontPath = new THREE.Mesh(
    new THREE.BoxGeometry(buildingWidth + pathOffset * 2, 0.03, pathWidth),
    pathMaterial,
  )

  frontPath.position.set(0, 0.015, buildingDepth / 2 + pathOffset)

  frontPath.receiveShadow = true

  group.add(frontPath)

  const backPath = new THREE.Mesh(
    new THREE.BoxGeometry(buildingWidth + pathOffset * 2, 0.03, pathWidth),
    pathMaterial,
  )

  backPath.position.set(0, 0.015, -(buildingDepth / 2 + pathOffset))

  backPath.receiveShadow = true

  group.add(backPath)

  const leftPath = new THREE.Mesh(
    new THREE.BoxGeometry(pathWidth, 0.03, buildingDepth + pathOffset * 2),
    pathMaterial,
  )

  leftPath.position.set(-(buildingWidth / 2 + pathOffset), 0.015, 0)

  leftPath.receiveShadow = true

  group.add(leftPath)

  const rightPath = new THREE.Mesh(
    new THREE.BoxGeometry(pathWidth, 0.03, buildingDepth + pathOffset * 2),
    pathMaterial,
  )

  rightPath.position.set(buildingWidth / 2 + pathOffset, 0.015, 0)

  rightPath.receiveShadow = true

  group.add(rightPath)

  return group
}
