import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '@/stores/auth.store'
import { act } from '@testing-library/react'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useAuthStore.setState({
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        isAuthenticated: false,
      })
    })
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have null tokens initially', () => {
      const state = useAuthStore.getState()

      expect(state.accessToken).toBeNull()
      expect(state.refreshToken).toBeNull()
      expect(state.expiresAt).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('setAccessToken', () => {
    it('should set access token', () => {
      act(() => {
        useAuthStore.getState().setAccessToken('new-access-token')
      })

      expect(useAuthStore.getState().accessToken).toBe('new-access-token')
    })
  })

  describe('setRefreshToken', () => {
    it('should set refresh token', () => {
      act(() => {
        useAuthStore.getState().setRefreshToken('new-refresh-token')
      })

      expect(useAuthStore.getState().refreshToken).toBe('new-refresh-token')
    })
  })

  describe('login', () => {
    it('should set all auth data on login', () => {
      const loginData = {
        access_token: 'access-123',
        refresh_token: 'refresh-456',
        expires_in: 3600,
      }

      const beforeLogin = Date.now()
      
      act(() => {
        useAuthStore.getState().login(loginData)
      })

      const state = useAuthStore.getState()

      expect(state.accessToken).toBe('access-123')
      expect(state.refreshToken).toBe('refresh-456')
      expect(state.isAuthenticated).toBe(true)
      // expiresAt should be roughly now + 3600 seconds
      expect(state.expiresAt).toBeGreaterThanOrEqual(beforeLogin + 3600 * 1000)
    })

    it('should calculate correct expiration time', () => {
      vi.useFakeTimers()
      const mockNow = 1000000000000 // Fixed timestamp
      vi.setSystemTime(mockNow)

      const loginData = {
        access_token: 'access-123',
        refresh_token: 'refresh-456',
        expires_in: 3600, // 1 hour
      }

      act(() => {
        useAuthStore.getState().login(loginData)
      })

      const state = useAuthStore.getState()
      expect(state.expiresAt).toBe(mockNow + 3600 * 1000)

      vi.useRealTimers()
    })
  })

  describe('logout', () => {
    it('should clear all auth data on logout', () => {
      // First login
      act(() => {
        useAuthStore.getState().login({
          access_token: 'access-123',
          refresh_token: 'refresh-456',
          expires_in: 3600,
        })
      })

      // Verify logged in
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Then logout
      act(() => {
        useAuthStore.getState().logout()
      })

      const state = useAuthStore.getState()

      expect(state.accessToken).toBeNull()
      expect(state.refreshToken).toBeNull()
      expect(state.expiresAt).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('state transitions', () => {
    it('should maintain correct state after multiple operations', () => {
      // Login
      act(() => {
        useAuthStore.getState().login({
          access_token: 'access-1',
          refresh_token: 'refresh-1',
          expires_in: 3600,
        })
      })

      expect(useAuthStore.getState().accessToken).toBe('access-1')

      // Update access token (e.g., after refresh)
      act(() => {
        useAuthStore.getState().setAccessToken('access-2')
      })

      expect(useAuthStore.getState().accessToken).toBe('access-2')
      expect(useAuthStore.getState().refreshToken).toBe('refresh-1')
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      // Logout
      act(() => {
        useAuthStore.getState().logout()
      })

      expect(useAuthStore.getState().accessToken).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
