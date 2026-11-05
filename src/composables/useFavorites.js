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

  const toggleFavorite = (apartmentId) => {
    if (favoriteIds.value.includes(apartmentId)) {
      removeFavorite(apartmentId)
    } else {
      addFavorite(apartmentId)
    }
  }

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
}
