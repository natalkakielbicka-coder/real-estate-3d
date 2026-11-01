import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isApartmentSelectable } from '@/utils/isApartmentSelectable'
import { buildPresentationQuery, parsePresentationQuery } from '@/utils/presentationQuery'

export const usePresentationQuerySync = ({
  threeScene,
  selectedFloor,
  selectedApartment,
  onClose,
  onApartmentSelect,
  onApartmentBack,
}) => {
  const router = useRouter()
  const route = useRoute()

  const openFromQuery = (query) => {
    const { floorNumber, apartmentId } = parsePresentationQuery(query)

    if (floorNumber === null) {
      onClose()
      return
    }

    threeScene.value?.selectFloorByNumber(floorNumber)

    if (selectedFloor.value?.floorNumber !== floorNumber) {
      onClose()
      router.replace({ query: {} })
      return
    }

    const apartment = selectedFloor.value.apartments.find(
      (item) => item.id === apartmentId && isApartmentSelectable(item),
    )

    if (apartmentId && !apartment) {
      router.replace({ query: buildPresentationQuery({ floor: selectedFloor.value }) })
    }

    if (apartment && apartment.id !== selectedApartment.value?.id) {
      onApartmentSelect(apartment)
    } else if (!apartment && selectedApartment.value) {
      onApartmentBack()
    }
  }

  onMounted(() => {
    openFromQuery(route.query)
  })

  watch(() => route.query, openFromQuery)

  watch([selectedFloor, selectedApartment], ([floor, apartment], [, previousApartment]) => {
    if (!floor) {
      router.push({ query: {} })
      return
    }

    const query = buildPresentationQuery({ floor, apartment })

    if (apartment && previousApartment) {
      router.replace({ query })
    } else {
      router.push({ query })
    }
  })
}
