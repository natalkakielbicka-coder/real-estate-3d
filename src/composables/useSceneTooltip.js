import { ref } from 'vue'
import { formatPrice } from '../utils/apartmentFormatters'

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
      tooltip.value.floor =
        selectedFloor?.userData.floorNumber === 0 ? 'Parter' : selectedFloor?.userData.floorNumber

      tooltip.value.rooms = object.userData.rooms
      tooltip.value.price = formatPrice(object.userData.price)
    }

    if (object.userData.type === 'floor') {
      tooltip.value.title =
        object.userData.floorNumber === 0 ? 'Parter' : `Piętro ${object.userData.floorNumber}`

      tooltip.value.description = `${object.userData.availableApartments} z ${object.userData.apartmentCount} dostępnych`

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
