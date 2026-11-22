import * as THREE from 'three'

export const useRaycastInteraction = ({ sceneContainer, camera, building }) => {
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  const getInteractiveIntersection = (event) => {
    const container = sceneContainer.value
    const rect = container.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    if (
      rect.width <= 0 ||
      rect.height <= 0 ||
      x < 0 ||
      y < 0 ||
      x >= rect.width ||
      y >= rect.height
    ) {
      return { intersection: undefined, rect }
    }

    pointer.x = (x / rect.width) * 2 - 1
    pointer.y = 1 - (y / rect.height) * 2

    raycaster.setFromCamera(pointer, camera)

    const intersections = raycaster.intersectObjects(building.children, true)

    const intersection = intersections.find((item) => {
      const object = item.object
      const type = object.userData.type

      if (type !== 'apartment' && type !== 'floor') {
        return false
      }

      for (let node = object; node; node = node.parent) {
        if (!node.visible) {
          return false
        }
      }

      return true
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
