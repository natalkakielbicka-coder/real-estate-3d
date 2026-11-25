const getViewportCameraDistance = (width) => {
  if (width < 700) return 12.5
  if (width < 900) return 11.5
  if (width < 1200) return 10.5
  return 9.5
}

export const useSceneResize = ({ sceneContainer, camera, renderer, controls }) => {
  let resizeObserver = null
  let previousViewportDistance

  const updateCameraForViewport = (distance) => {
    const direction = camera.position.clone().sub(controls.target).normalize()

    camera.position.copy(controls.target.clone().add(direction.multiplyScalar(distance)))

    controls.update()
  }

  const handleResize = () => {
    const container = sceneContainer.value

    if (!container) {
      return
    }

    const { width, height } = container.getBoundingClientRect()

    if (!width || !height) {
      return
    }

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height, false)

    const viewportDistance = getViewportCameraDistance(width)

    if (viewportDistance !== previousViewportDistance) {
      updateCameraForViewport(viewportDistance)
      previousViewportDistance = viewportDistance
    }
  }

  const startResizeObserver = () => {
    resizeObserver = new ResizeObserver(handleResize)

    resizeObserver.observe(sceneContainer.value)

    window.addEventListener('resize', handleResize)

    handleResize()
  }

  const stopResizeObserver = () => {
    resizeObserver?.disconnect()

    window.removeEventListener('resize', handleResize)
  }

  return {
    handleResize,
    startResizeObserver,
    stopResizeObserver,
  }
}
