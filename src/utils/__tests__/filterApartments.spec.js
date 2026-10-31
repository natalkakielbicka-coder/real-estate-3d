import { describe, expect, it } from 'vitest'
import { filterApartments } from '../filterApartments'

const apartments = [
  {
    id: 'A1',
    rooms: 1,
    area: 30,
    price: 300000,
    status: 'available',
  },
  {
    id: 'A2',
    rooms: 2,
    area: 45,
    price: 450000,
    status: 'reserved',
  },
  {
    id: 'A3',
    rooms: 3,
    area: 60,
    price: 600000,
    status: 'available',
  },
  {
    id: 'A4',
    rooms: 4,
    area: 80,
    price: 800000,
    status: 'sold',
  },
  {
    id: 'A5',
    rooms: 5,
    area: 100,
    price: 950000,
    status: 'available',
  },
]

const getIds = (result) => result.map((apartment) => apartment.id)

describe('filterApartments', () => {
  it('returns all apartments when filters are empty', () => {
    expect(filterApartments(apartments, {})).toEqual(apartments)
  })

  it('filters by room count', () => {
    const result = filterApartments(apartments, {
      rooms: [2],
    })

    expect(getIds(result)).toEqual(['A2'])
  })

  it('handles 4+ rooms', () => {
    const result = filterApartments(apartments, {
      rooms: [4],
    })

    expect(getIds(result)).toEqual(['A4', 'A5'])
  })

  it('filters by multiple room counts', () => {
    const result = filterApartments(apartments, {
      rooms: [1, 3],
    })

    expect(getIds(result)).toEqual(['A1', 'A3'])
  })

  it('filters by status', () => {
    const result = filterApartments(apartments, {
      statuses: ['reserved'],
    })

    expect(getIds(result)).toEqual(['A2'])
  })

  it('filters by multiple statuses', () => {
    const result = filterApartments(apartments, {
      statuses: ['available', 'reserved'],
    })

    expect(getIds(result)).toEqual(['A1', 'A2', 'A3', 'A5'])
  })

  it('filters by minimum area', () => {
    const result = filterApartments(apartments, {
      minArea: '60',
    })

    expect(getIds(result)).toEqual(['A3', 'A4', 'A5'])
  })

  it('filters by maximum area', () => {
    const result = filterApartments(apartments, {
      maxArea: '45',
    })

    expect(getIds(result)).toEqual(['A1', 'A2'])
  })

  it('filters by area range', () => {
    const result = filterApartments(apartments, {
      minArea: '45',
      maxArea: '80',
    })

    expect(getIds(result)).toEqual(['A2', 'A3', 'A4'])
  })

  it('filters by minimum price', () => {
    const result = filterApartments(apartments, {
      minPrice: '600000',
    })

    expect(getIds(result)).toEqual(['A3', 'A4', 'A5'])
  })

  it('filters by maximum price', () => {
    const result = filterApartments(apartments, {
      maxPrice: '450000',
    })

    expect(getIds(result)).toEqual(['A1', 'A2'])
  })

  it('filters by price range', () => {
    const result = filterApartments(apartments, {
      minPrice: '450000',
      maxPrice: '800000',
    })

    expect(getIds(result)).toEqual(['A2', 'A3', 'A4'])
  })

  it('combines multiple filters', () => {
    const result = filterApartments(apartments, {
      rooms: [3, 4],
      statuses: ['available'],
      minArea: '50',
      maxArea: '110',
      minPrice: '500000',
      maxPrice: '1000000',
    })

    expect(getIds(result)).toEqual(['A3', 'A5'])
  })

  it('ignores empty range fields', () => {
    const result = filterApartments(apartments, {
      minArea: '',
      maxArea: '',
      minPrice: '',
      maxPrice: '',
    })

    expect(result).toHaveLength(5)
  })

  it('accepts numeric zero as a minimum bound', () => {
    const result = filterApartments(apartments, {
      minArea: 0,
      minPrice: 0,
    })

    expect(result).toHaveLength(5)
  })

  it('returns an empty array when nothing matches', () => {
    const result = filterApartments(apartments, {
      minPrice: '2000000',
    })

    expect(result).toEqual([])
  })

  it('does not mutate the original array', () => {
    const original = [...apartments]

    filterApartments(apartments, { rooms: [2] })

    expect(apartments).toEqual(original)
  })
})
