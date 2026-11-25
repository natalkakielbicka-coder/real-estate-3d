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

  it('preserves the camera distance when only the scene height changes', () => {
    const width = 1000
    let height = 400
    const camera = new PerspectiveCamera()
    camera.position.set(0, 0, 5)

    const controls = { target: new Vector3(), update: vi.fn() }
    const renderer = { setSize: vi.fn() }
    const sceneContainer = {
      value: { getBoundingClientRect: () => ({ width, height }) },
    }
    const { handleResize } = useSceneResize({ sceneContainer, camera, renderer, controls })

    handleResize()
    camera.position.set(0, 0, 7)
    height = 500

    handleResize()

    expect(renderer.setSize).toHaveBeenLastCalledWith(1000, 500, false)
    expect(camera.aspect).toBeCloseTo(2)
    expect(camera.position.distanceTo(controls.target)).toBeCloseTo(7)
  })

  it.each([
    [0, 400],
    [1000, 0],
  ])('ignores a scene measuring %i × %i px', (width, height) => {
    const camera = new PerspectiveCamera()
    camera.position.set(0, 0, 5)
    const updateProjectionMatrix = vi.spyOn(camera, 'updateProjectionMatrix')
    const controls = { target: new Vector3(), update: vi.fn() }
    const renderer = { setSize: vi.fn() }
    const sceneContainer = {
      value: { getBoundingClientRect: () => ({ width, height }) },
    }
    const { handleResize } = useSceneResize({ sceneContainer, camera, renderer, controls })

    handleResize()

    expect(renderer.setSize).not.toHaveBeenCalled()
    expect(updateProjectionMatrix).not.toHaveBeenCalled()
    expect(controls.update).not.toHaveBeenCalled()
    expect(camera.position.toArray()).toEqual([0, 0, 5])
  })

  it('disconnects the observer and stops handling window resize events', () => {
    const observe = vi.fn()
    const disconnect = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = observe
        disconnect = disconnect
      },
    )

    const container = { getBoundingClientRect: () => ({ width: 1000, height: 400 }) }
    const sceneContainer = { value: container }
    const camera = new PerspectiveCamera()
    const controls = { target: new Vector3(), update: vi.fn() }
    const renderer = { setSize: vi.fn() }
    const { handleResize, startResizeObserver, stopResizeObserver } = useSceneResize({
      sceneContainer,
      camera,
      renderer,
      controls,
    })

    try {
      startResizeObserver()
      expect(observe).toHaveBeenCalledWith(container)

      renderer.setSize.mockClear()
      window.dispatchEvent(new Event('resize'))
      expect(renderer.setSize).toHaveBeenCalledOnce()

      stopResizeObserver()
      expect(disconnect).toHaveBeenCalledOnce()

      renderer.setSize.mockClear()
      window.dispatchEvent(new Event('resize'))
      expect(renderer.setSize).not.toHaveBeenCalled()
    } finally {
      window.removeEventListener('resize', handleResize)
      vi.unstubAllGlobals()
    }
  })

  it('preserves the camera distance when the width stays in the same range', () => {
    let width = 1000
    const height = 400
    const camera = new PerspectiveCamera()
    camera.position.set(0, 0, 5)

    const controls = { target: new Vector3(), update: vi.fn() }
    const renderer = { setSize: vi.fn() }
    const sceneContainer = {
      value: { getBoundingClientRect: () => ({ width, height }) },
    }
    const { handleResize } = useSceneResize({ sceneContainer, camera, renderer, controls })

    handleResize()
    camera.position.set(0, 0, 7)
    width = 1050

    handleResize()

    expect(renderer.setSize).toHaveBeenLastCalledWith(1050, 400, false)
    expect(camera.aspect).toBeCloseTo(1050 / 400)
    expect(camera.position.distanceTo(controls.target)).toBeCloseTo(7)
  })
})
