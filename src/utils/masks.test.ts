import { describe, it, expect } from 'vitest'
import { applyPhoneMask, applyCpfMask, applyCepMask } from './masks'

describe('Masks', () => {
  describe('applyPhoneMask', () => {
    it('should format phone number with 10 digits', () => {
      expect(applyPhoneMask('1234567890')).toBe('(12) 3456-7890')
    })

    it('should format phone number with 11 digits', () => {
      expect(applyPhoneMask('12345678901')).toBe('(12) 34567-8901')
    })

    it('should remove non-numeric characters', () => {
      expect(applyPhoneMask('(12) 3456-7890')).toBe('(12) 3456-7890')
    })
  })

  describe('applyCpfMask', () => {
    it('should format CPF correctly', () => {
      expect(applyCpfMask('12345678901')).toBe('123.456.789-01')
    })

    it('should handle incomplete CPF', () => {
      expect(applyCpfMask('123456789')).toBe('123.456.789')
    })
  })

  describe('applyCepMask', () => {
    it('should format CEP correctly', () => {
      expect(applyCepMask('12345678')).toBe('12345-678')
    })

    it('should handle incomplete CEP', () => {
      expect(applyCepMask('12345')).toBe('12345')
    })
  })
})

