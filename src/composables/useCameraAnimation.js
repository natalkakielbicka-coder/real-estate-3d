export const useCameraAnimation = ({ camera, controls, animationSpeed, animationThreshold }) => {
  let cameraTargetPosition = null
  let controlsTargetPosition = null

  const setCameraTarget = (cameraPosition, controlsPosition) => {
    cameraTargetPosition = cameraPosition.clone()
    controlsTargetPosition = controlsPosition.clone()
  }

  const updateCameraAnimation = () => {
    if (!cameraTargetPosition || !controlsTargetPosition) {
      return
    }

    camera.position.lerp(cameraTargetPosition, animationSpeed)

    controls.target.lerp(controlsTargetPosition, animationSpeed)

    const cameraFinished = camera.position.distanceTo(cameraTargetPosition) < animationThreshold

    const targetFinished = controls.target.distanceTo(controlsTargetPosition) < animationThreshold

    if (!cameraFinished || !targetFinished) {
      return
    }

    camera.position.copy(cameraTargetPosition)
    controls.target.copy(controlsTargetPosition)

    cameraTargetPosition = null
    controlsTargetPosition = null
  }

  return {
    setCameraTarget,
    updateCameraAnimation,
  }
}
