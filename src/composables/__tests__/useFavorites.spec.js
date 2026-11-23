import { effectScope } from 'vue'
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
