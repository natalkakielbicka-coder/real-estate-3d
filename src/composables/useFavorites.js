import { ref } from 'vue'
import { addFavoriteApartment } from '@/utils/addFavoriteApartment'
import { removeFavoriteApartment } from '@/utils/removeFavoriteApartment'

export const useFavorites = () => {
  const favoriteIds = ref([])

  const addFavorite = (apartmentId) => {
    favoriteIds.value = addFavoriteApartment(favoriteIds.value, apartmentId)
  }

  const removeFavorite = (apartmentId) => {
    favoriteIds.value = removeFavoriteApartment(favoriteIds.value, apartmentId)
  }

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
  }
}
