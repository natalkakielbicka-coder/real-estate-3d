import * as THREE from 'three'

export const createApartmentPreview = ({
  floor,
  buildingWidth,
  buildingDepth,
  floorHeight,
  apartmentStatuses,
}) => {
  const apartments = floor.userData.apartments

  const preview = new THREE.Group()

  preview.name = 'apartment-preview'

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
      color: apartmentStatuses[apartment.status]?.threeColor ?? 0x777777,
      roughness: 0.7,
      transparent: true,
      opacity: 1,
      emissiveIntensity: 0,
    })

    const apartmentMesh = new THREE.Mesh(geometry, material)

    apartmentMesh.castShadow = true
    apartmentMesh.receiveShadow = true

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

    preview.add(apartmentMesh)
  })

  return preview
}
