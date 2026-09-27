export const useCameraAnimation = ({ camera, controls, animationSpeed, animationThreshold }) => {
  let cameraTargetPosition = null
  let controlsTargetPosition = null
  let cameraPositionBeforeFocus = null
  let controlsTargetBeforeFocus = null

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

  const saveCurrentCameraPosition = () => {
    cameraPositionBeforeFocus = camera.position.clone()
    controlsTargetBeforeFocus = controls.target.clone()
  }

  const restorePreviousCameraPosition = () => {
    if (!cameraPositionBeforeFocus || !controlsTargetBeforeFocus) {
      return
    }

    setCameraTarget(cameraPositionBeforeFocus, controlsTargetBeforeFocus)

    cameraPositionBeforeFocus = null
    controlsTargetBeforeFocus = null
  }

  const clearSavedCameraPosition = () => {
    cameraPositionBeforeFocus = null
    controlsTargetBeforeFocus = null
  }

  return {
    setCameraTarget,
    updateCameraAnimation,
    saveCurrentCameraPosition,
    restorePreviousCameraPosition,
    clearSavedCameraPosition,
  }
}
