import * as THREE from 'three'

export const createBuildingMesh = ({
  buildingData,
  buildingWidth,
  buildingDepth,
  floorHeight,
  floorGap,
}) => {
  const building = new THREE.Group()

  const floorCount = buildingData.floors.length

  for (let i = 0; i < floorCount; i += 1) {
    const floorData = buildingData.floors[i]

    const geometry = new THREE.BoxGeometry(buildingWidth, floorHeight, buildingDepth)

    const material = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0xd8dcd5 : 0xcbd1c8,
      roughness: 0.72,
    })

    const floor = new THREE.Mesh(geometry, material)

    floor.castShadow = true
    floor.receiveShadow = true

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
    color: 0x9da69a,
    roughness: 0.85,
  })

  const roof = new THREE.Mesh(roofGeometry, roofMaterial)

  roof.castShadow = true
  roof.receiveShadow = true

  roof.position.y = floorCount * (floorHeight + floorGap) + 0.02

  building.add(roof)

  return building
}
