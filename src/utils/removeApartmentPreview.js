export const removeApartmentPreview = ({ apartmentPreview, building }) => {
  if (!apartmentPreview) {
    return
  }

  apartmentPreview.traverse((object) => {
    if (!object.isMesh) {
      return
    }

    object.geometry?.dispose()

    if (Array.isArray(object.material)) {
      object.material.forEach((material) => {
        material.dispose()
      })
    } else {
      object.material?.dispose()
    }
  })

  building.remove(apartmentPreview)
}
