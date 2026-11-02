export function getBalconyLabel(balcony) {
  if (balcony === undefined) {
    return 'Brak danych'
  }

  return balcony ? 'Balkon' : 'Brak balkonu'
}
