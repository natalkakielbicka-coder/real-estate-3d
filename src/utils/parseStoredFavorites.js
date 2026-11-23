export const parseStoredFavorites = (storedValue) => {
  try {
    const parsedValue = JSON.parse(storedValue)
    if (Array.isArray(parsedValue) && parsedValue.every((id) => typeof id === 'string')) {
      return [...new Set(parsedValue)]
    }
    return []
  } catch (error) {
    console.error('Error parsing stored favorites:', error)
    return []
  }
}
