import { computed, ref } from 'vue'
import { filterApartments } from '@/utils/filterApartments'
import { getRangeError } from '@/utils/getRangeError'

const toggleValue = (list, value) => {
  list.value = list.value.includes(value)
    ? list.value.filter((item) => item !== value)
    : [...list.value, value]
}

export const useApartmentSearch = (apartments) => {
  const selectedRooms = ref([])
  const selectedStatuses = ref([])

  const minArea = ref('')
  const maxArea = ref('')

  const minPrice = ref('')
  const maxPrice = ref('')

  const filters = computed(() => ({
    rooms: selectedRooms.value,
    statuses: selectedStatuses.value,
    minArea: minArea.value,
    maxArea: maxArea.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
  }))

  const filteredApartments = computed(() => filterApartments(apartments, filters.value))

  const rangeError = computed(() => getRangeError(filters.value))

  const toggleRoom = (rooms) => toggleValue(selectedRooms, rooms)

  const toggleStatus = (status) => toggleValue(selectedStatuses, status)

  const resetFilters = () => {
    selectedRooms.value = []
    selectedStatuses.value = []

    minArea.value = ''
    maxArea.value = ''

    minPrice.value = ''
    maxPrice.value = ''
  }

  return {
    selectedRooms,
    selectedStatuses,
    minArea,
    maxArea,
    minPrice,
    maxPrice,
    filteredApartments,
    rangeError,
    toggleRoom,
    toggleStatus,
    resetFilters,
  }
}
