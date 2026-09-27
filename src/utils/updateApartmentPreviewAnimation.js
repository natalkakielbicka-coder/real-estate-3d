import * as THREE from 'three'

export const updateApartmentPreviewAnimation = ({
  apartmentPreview,
  selectedApartmentMesh,
  apartmentRevealSpeed,
}) => {
  if (!apartmentPreview) {
    return
  }

  apartmentPreview.children.forEach((apartmentMesh) => {
    if (apartmentMesh.userData.animationProgress < 1) {
      apartmentMesh.userData.animationProgress += apartmentRevealSpeed
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
