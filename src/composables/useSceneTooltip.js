import { ref } from 'vue'
import { formatPrice, formatFloorLabel } from '../utils/apartmentFormatters'
import { getAvailableApartments } from '../utils/getAvailableApartments'

export const useSceneTooltip = () => {
  const tooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    type: '',
    title: '',
    status: '',
    area: '',
    floor: '',
    rooms: '',
    description: '',
    price: '',
  })

  const hideTooltip = () => {
    tooltip.value.visible = false
  }

  const showTooltip = (object, event, rect, selectedFloor) => {
    tooltip.value.x = event.clientX - rect.left - 72
    tooltip.value.y = event.clientY - rect.top

    if (object.userData.type === 'apartment') {
      tooltip.value.type = 'apartment'
      tooltip.value.title = object.userData.number
      tooltip.value.status = object.userData.status
      tooltip.value.area = `${object.userData.area} m²`
      tooltip.value.floor = formatFloorLabel(
        object.userData.floorNumber ?? selectedFloor?.userData.floorNumber,
      )

      tooltip.value.rooms = object.userData.rooms
      tooltip.value.price = formatPrice(object.userData.price)
    }

    if (object.userData.type === 'floor') {
      const { apartments, floorNumber } = object.userData
      const availableCount = getAvailableApartments(apartments).length

      tooltip.value.title = formatFloorLabel(floorNumber)
      tooltip.value.description = `${availableCount} z ${apartments.length} dostępnych`
      tooltip.value.type = 'floor'
    }

    tooltip.value.visible = true
  }

  return {
    tooltip,
    showTooltip,
    hideTooltip,
  }
}
