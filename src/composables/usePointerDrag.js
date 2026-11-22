export const usePointerDrag = ({ dragThreshold }) => {
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
      return false
    }

    const distance = Math.hypot(event.clientX - pointerDownX, event.clientY - pointerDownY)

    if (distance > dragThreshold) {
      pointerDragged = true
    }

    return pointerDragged
  }

  const handlePointerUp = () => {
    isPointerDown = false
  }

  const handlePointerCancel = () => {
    isPointerDown = false
    pointerDragged = false
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
    handlePointerCancel,
    consumePointerDrag,
  }
}
