const disposeObject3D = (object) => {
  object?.traverse((child) => {
    if (!child.isMesh) {
      return
    }

    child.geometry?.dispose()

    if (Array.isArray(child.material)) {
      child.material.forEach((material) => {
        material.dispose()
      })

      return
    }

    child.material?.dispose()
  })
}

export const disposeThreeScene = ({ building, ground, controls, renderer }) => {
  disposeObject3D(building)
  disposeObject3D(ground)

  controls?.dispose()

  if (!renderer) {
    return
  }

  renderer.dispose()
  renderer.domElement.remove()
}
