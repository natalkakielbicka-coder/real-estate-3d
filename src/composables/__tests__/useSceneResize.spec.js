import { describe, expect, it, vi } from 'vitest'
import { PerspectiveCamera, Vector3 } from 'three'
import { useSceneResize } from '../useSceneResize'

describe('useSceneResize', () => {
  it.each([
    [699, 12.5],
    [700, 11.5],
    [899, 11.5],
    [900, 10.5],
    [1199, 10.5],
    [1200, 9.5],
  ])('sets the camera distance for a scene width of %i px', (width, distance) => {
    const height = 400
    const camera = new PerspectiveCamera()
    camera.position.set(0, 0, 5)

    const controls = { target: new Vector3(), update: vi.fn() }
    const renderer = { setSize: vi.fn() }
    const sceneContainer = {
      value: {
        clientWidth: 1300,
        getBoundingClientRect: () => ({ width, height }),
      },
    }
    const { handleResize } = useSceneResize({ sceneContainer, camera, renderer, controls })

    handleResize()

    expect(renderer.setSize).toHaveBeenCalledWith(width, height, false)
    expect(camera.aspect).toBeCloseTo(width / height)
    expect(camera.position.distanceTo(controls.target)).toBeCloseTo(distance)
  })
})
