import { effectScope, nextTick } from 'vue'
import { expect, it, vi } from 'vitest'
import { useFavorites } from '../useFavorites'

it('starts with no favorites when storage reads are blocked', () => {
  const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new DOMException('Storage access denied', 'SecurityError')
  })
  const scope = effectScope()

  try {
    scope.run(() => {
      const { favoriteIds } = useFavorites()

      expect(getItem).toHaveBeenCalledWith('favoriteApartments')
      expect(favoriteIds.value).toEqual([])
    })
  } finally {
    scope.stop()
    getItem.mockRestore()
  }
})

it('keeps favorites usable when storage writes fail', async () => {
  const getItem = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
  const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Storage quota exceeded', 'QuotaExceededError')
  })
  const scope = effectScope()

  try {
    const { favoriteIds, addFavorite, removeFavorite } = scope.run(useFavorites)

    addFavorite('a-12')
    await nextTick()

    expect(setItem).toHaveBeenNthCalledWith(1, 'favoriteApartments', '["a-12"]')
    expect(favoriteIds.value).toEqual(['a-12'])

    removeFavorite('a-12')
    await nextTick()

    expect(setItem).toHaveBeenNthCalledWith(2, 'favoriteApartments', '[]')
    expect(favoriteIds.value).toEqual([])
  } finally {
    scope.stop()
    setItem.mockRestore()
    getItem.mockRestore()
  }
})
