import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isApartmentSelectable } from '@/utils/isApartmentSelectable'
import { buildPresentationQuery, parsePresentationQuery } from '@/utils/presentationQuery'

const withoutPresentationSelection = (query) => {
  const remainingQuery = { ...query }
  delete remainingQuery.floor
  delete remainingQuery.apartment
  return remainingQuery
}

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

    if (selectedFloor.value?.floorNumber !== floorNumber) {
      threeScene.value?.selectFloorByNumber(floorNumber)
    }

    if (selectedFloor.value?.floorNumber !== floorNumber) {
      onClose()
      router.replace({ query: withoutPresentationSelection(query), hash: route.hash })
      return
    }

    const apartment = selectedFloor.value.apartments.find(
      (item) => item.id === apartmentId && isApartmentSelectable(item),
    )

    if (apartmentId && !apartment) {
      router.replace({
        hash: route.hash,
        query: {
          ...withoutPresentationSelection(query),
          ...buildPresentationQuery({ floor: selectedFloor.value }),
        },
      })
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
      router.push({ query: withoutPresentationSelection(route.query), hash: route.hash })
      return
    }

    const query = {
      ...withoutPresentationSelection(route.query),
      ...buildPresentationQuery({ floor, apartment }),
    }

    if (apartment && previousApartment) {
      router.replace({ query, hash: route.hash })
    } else {
      router.push({ query, hash: route.hash })
    }
  })
}
