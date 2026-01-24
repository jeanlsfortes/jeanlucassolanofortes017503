import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/stores/app.store'
import { act } from '@testing-library/react'

describe('AppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useAppStore.setState({
        isLoading: false,
        error: null,
      })
    })
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useAppStore.getState()

      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('setLoading', () => {
    it('should set loading to true', () => {
      act(() => {
        useAppStore.getState().setLoading(true)
      })

      expect(useAppStore.getState().isLoading).toBe(true)
    })

    it('should set loading to false', () => {
      // First set to true
      act(() => {
        useAppStore.getState().setLoading(true)
      })

      expect(useAppStore.getState().isLoading).toBe(true)

      // Then set to false
      act(() => {
        useAppStore.getState().setLoading(false)
      })

      expect(useAppStore.getState().isLoading).toBe(false)
    })
  })

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Something went wrong'

      act(() => {
        useAppStore.getState().setError(errorMessage)
      })

      expect(useAppStore.getState().error).toBe(errorMessage)
    })

    it('should set error to null', () => {
      // First set an error
      act(() => {
        useAppStore.getState().setError('Error')
      })

      // Then clear it
      act(() => {
        useAppStore.getState().setError(null)
      })

      expect(useAppStore.getState().error).toBeNull()
    })
  })

  describe('clearError', () => {
    it('should clear existing error', () => {
      // Set an error
      act(() => {
        useAppStore.getState().setError('An error occurred')
      })

      expect(useAppStore.getState().error).toBe('An error occurred')

      // Clear the error
      act(() => {
        useAppStore.getState().clearError()
      })

      expect(useAppStore.getState().error).toBeNull()
    })

    it('should work even when no error exists', () => {
      // No error set initially
      expect(useAppStore.getState().error).toBeNull()

      // Clear error should not throw
      act(() => {
        useAppStore.getState().clearError()
      })

      expect(useAppStore.getState().error).toBeNull()
    })
  })

  describe('state independence', () => {
    it('should not affect loading state when setting error', () => {
      act(() => {
        useAppStore.getState().setLoading(true)
      })

      act(() => {
        useAppStore.getState().setError('Error')
      })

      const state = useAppStore.getState()
      expect(state.isLoading).toBe(true)
      expect(state.error).toBe('Error')
    })

    it('should not affect error when setting loading', () => {
      act(() => {
        useAppStore.getState().setError('Error')
      })

      act(() => {
        useAppStore.getState().setLoading(true)
      })

      const state = useAppStore.getState()
      expect(state.isLoading).toBe(true)
      expect(state.error).toBe('Error')
    })
  })
})
