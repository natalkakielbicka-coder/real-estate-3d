import { ref, watch } from 'vue'
import { addFavoriteApartment } from '@/utils/addFavoriteApartment'
import { removeFavoriteApartment } from '@/utils/removeFavoriteApartment'
import { parseStoredFavorites } from '@/utils/parseStoredFavorites'

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

  const loadFavorites = () => {
    const storedFavorites = localStorage.getItem('favoriteApartments')
    favoriteIds.value = parseStoredFavorites(storedFavorites)
  }

  loadFavorites()

  watch(favoriteIds, (newFavorites) => {
    localStorage.setItem('favoriteApartments', JSON.stringify(newFavorites))
  })

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
}
