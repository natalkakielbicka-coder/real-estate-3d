import { describe, expect, it } from 'vitest'
import { usePointerDrag } from '../usePointerDrag'

describe('usePointerDrag', () => {
  const start = { clientX: 10, clientY: 10 }

  it('allows hover and clicks when movement stays within the drag threshold', () => {
    const drag = usePointerDrag({ dragThreshold: 5 })
    const pointAtThreshold = { clientX: 13, clientY: 14 }

    expect(drag.handlePointerMove(pointAtThreshold)).toBe(false)

    drag.handlePointerDown(start)
    expect(drag.handlePointerMove(pointAtThreshold)).toBe(false)

    drag.handlePointerUp()
    expect(drag.consumePointerDrag()).toBe(false)
  })

  it('keeps dragging active until release and suppresses the following click once', () => {
    const drag = usePointerDrag({ dragThreshold: 5 })
    const pointBeyondThreshold = { clientX: 16, clientY: 10 }

    drag.handlePointerDown(start)
    expect(drag.handlePointerMove(pointBeyondThreshold)).toBe(true)
    expect(drag.handlePointerMove(start)).toBe(true)

    drag.handlePointerUp()
    expect(drag.handlePointerMove(pointBeyondThreshold)).toBe(false)
    expect(drag.consumePointerDrag()).toBe(true)
    expect(drag.consumePointerDrag()).toBe(false)
  })

  it('clears the active drag and pending click suppression on cancellation', () => {
    const drag = usePointerDrag({ dragThreshold: 5 })
    const pointBeyondThreshold = { clientX: 16, clientY: 10 }

    drag.handlePointerDown(start)
    expect(drag.handlePointerMove(pointBeyondThreshold)).toBe(true)

    drag.handlePointerCancel()

    expect(drag.handlePointerMove(pointBeyondThreshold)).toBe(false)
    expect(drag.consumePointerDrag()).toBe(false)
  })
})
