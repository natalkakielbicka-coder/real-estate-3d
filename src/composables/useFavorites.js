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
    let storedFavorites

    try {
      storedFavorites = localStorage.getItem('favoriteApartments')
    } catch {
      return
    }

    favoriteIds.value = parseStoredFavorites(storedFavorites)
  }

  loadFavorites()

  watch(favoriteIds, (newFavorites) => {
    try {
      localStorage.setItem('favoriteApartments', JSON.stringify(newFavorites))
    } catch {
      // Favorites remain available in memory until the page reloads.
    }
  })

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
}
