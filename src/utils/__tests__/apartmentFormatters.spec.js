import { describe, expect, it } from 'vitest'
import {
  getRoomsLabel,
  formatPrice,
  formatFloorLabel,
  formatPricePerSquareMeter,
  getApartmentsCountLabel,
} from '../apartmentFormatters'

describe('apartmentFormatters', () => {
  describe('getRoomsLabel', () => {
    it.each([
      [1, '1 pokój'],
      [2, '2 pokoje'],
      [3, '3 pokoje'],
      [4, '4 pokoje'],
      [5, '5 pokoi'],
      [10, '10 pokoi'],
    ])('formats %i rooms as %s', (rooms, expected) => {
      expect(getRoomsLabel(rooms)).toBe(expected)
    })
  })

  describe('formatFloorLabel', () => {
    it.each([
      [0, 'Parter'],
      [1, 'Piętro 1'],
      [2, 'Piętro 2'],
      [5, 'Piętro 5'],
    ])('formats floor %i', (floor, expected) => {
      expect(formatFloorLabel(floor)).toBe(expected)
    })
  })

  describe('formatPrice', () => {
    it('formats price in PLN', () => {
      expect(formatPrice(450000)).toContain('450')
      expect(formatPrice(450000)).toContain('000')
      expect(formatPrice(450000)).toContain('zł')
    })

    it('rounds to whole currency units', () => {
      expect(formatPrice(450000.49)).toBe(formatPrice(450000))
    })
  })

  describe('formatPricePerSquareMeter', () => {
    it('calculates price per square meter', () => {
      expect(formatPricePerSquareMeter(450000, 50)).toBe(`${formatPrice(9000)}/m²`)
    })

    it('handles zero area', () => {
      expect(formatPricePerSquareMeter(450000, 0)).toBe('—')
    })

    it('handles negative area', () => {
      expect(formatPricePerSquareMeter(450000, -10)).toBe('—')
    })

    it('handles invalid numbers', () => {
      expect(formatPricePerSquareMeter(NaN, 50)).toBe('—')
      expect(formatPricePerSquareMeter(450000, Infinity)).toBe('—')
    })
  })

  describe('getApartmentsCountLabel', () => {
    it('uses singular form for one apartment', () => {
      expect(getApartmentsCountLabel(1)).toBe('1 mieszkanie')
    })

    it('uses "mieszkania" for 2-4, 22-24 etc.', () => {
      expect(getApartmentsCountLabel(2)).toBe('2 mieszkania')
      expect(getApartmentsCountLabel(4)).toBe('4 mieszkania')
      expect(getApartmentsCountLabel(23)).toBe('23 mieszkania')
    })

    it('uses "mieszkań" for 0, 5-21 and teens', () => {
      expect(getApartmentsCountLabel(0)).toBe('0 mieszkań')
      expect(getApartmentsCountLabel(5)).toBe('5 mieszkań')
      expect(getApartmentsCountLabel(12)).toBe('12 mieszkań')
      expect(getApartmentsCountLabel(14)).toBe('14 mieszkań')
      expect(getApartmentsCountLabel(21)).toBe('21 mieszkań')
      expect(getApartmentsCountLabel(112)).toBe('112 mieszkań')
    })
  })
})
