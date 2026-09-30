export const useSceneResize = ({ sceneContainer, camera, renderer, controls }) => {
  let resizeObserver = null

  const updateCameraForViewport = () => {
    const container = sceneContainer.value

    if (!container) {
      return
    }

    const width = container.clientWidth

    let distance = 9.5

    if (width < 1200) {
      distance = 10.5
    }

    if (width < 900) {
      distance = 11.5
    }

    if (width < 700) {
      distance = 12.5
    }

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

    updateCameraForViewport()
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
