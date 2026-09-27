export const usePointerDrag = ({ dragThreshold, onDragStart }) => {
  let isPointerDown = false
  let pointerDragged = false
  let pointerDownX = 0
  let pointerDownY = 0

  const handlePointerDown = (event) => {
    isPointerDown = true
    pointerDragged = false

    pointerDownX = event.clientX
    pointerDownY = event.clientY
  }

  const handlePointerMove = (event) => {
    if (!isPointerDown) {
      return
    }

    const distance = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY)

    if (distance <= dragThreshold) {
      return
    }

    if (!pointerDragged) {
      onDragStart?.()
    }

    pointerDragged = true
  }

  const handlePointerUp = () => {
    isPointerDown = false
  }

  const consumePointerDrag = () => {
    if (!pointerDragged) {
      return false
    }

    pointerDragged = false

    return true
  }

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    consumePointerDrag,
  }
}
