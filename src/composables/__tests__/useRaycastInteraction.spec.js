import { describe, expect, it } from 'vitest'
import { OrthographicCamera, Mesh, BoxGeometry, MeshBasicMaterial } from 'three'
import { useRaycastInteraction } from '../useRaycastInteraction'

describe('useRaycastInteraction', () => {
  const rect = { left: 20, top: 30, width: 100, height: 100 }

  it.each([
    { clientX: 19, clientY: 80 },
    { clientX: 120, clientY: 80 },
    { clientX: 70, clientY: 29 },
    { clientX: 70, clientY: 130 },
  ])('skips raycasting outside the scene at $clientX, $clientY', (event) => {
    const { getInteractiveIntersection } = useRaycastInteraction({
      sceneContainer: { value: { getBoundingClientRect: () => rect } },
    })

    expect(getInteractiveIntersection(event)).toEqual({ intersection: undefined, rect })
  })

  it('skips raycasting when the scene has no width', () => {
    const collapsedRect = { ...rect, width: 0 }
    const { getInteractiveIntersection } = useRaycastInteraction({
      sceneContainer: { value: { getBoundingClientRect: () => collapsedRect } },
    })

    expect(getInteractiveIntersection({ clientX: 20, clientY: 80 })).toEqual({
      intersection: undefined,
      rect: collapsedRect,
    })
  })

  it('finds a floor at the center of an offset scene', () => {
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 5
    camera.updateMatrixWorld()

    const floor = new Mesh(new BoxGeometry(), new MeshBasicMaterial())
    floor.userData.type = 'floor'

    const { getInteractiveIntersection } = useRaycastInteraction({
      sceneContainer: { value: { getBoundingClientRect: () => rect } },
      camera,
      building: { children: [floor] },
    })

    expect(getInteractiveIntersection({ clientX: 70, clientY: 80 }).intersection?.object).toBe(
      floor,
    )
  })
})
