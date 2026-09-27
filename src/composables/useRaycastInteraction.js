import * as THREE from 'three'

export const useRaycastInteraction = ({ sceneContainer, camera, building }) => {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  const getInteractiveIntersection = (event) => {
    const container = sceneContainer.value
    const rect = container.getBoundingClientRect()

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)

    const intersections = raycaster.intersectObjects(building.children, true)

    const intersection = intersections.find((item) => {
      const object = item.object
      const type = object.userData.type

      return object.visible && (type === 'apartment' || type === 'floor')
    })

    return {
      intersection,
      rect,
    }
  }

  return {
    getInteractiveIntersection,
  }
}
