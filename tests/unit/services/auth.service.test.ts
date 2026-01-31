import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { authService } from '@/api/services/auth.service'
import apiClient from '@/@core/interceptors/axios.interceptor'
import { API_CONFIG } from '@/@core/configs/api.config'
import type { LoginResponse, RefreshTokenResponse } from '@/api/types/auth.types'

vi.mock('@/@core/interceptors/axios.interceptor')

const mockAxiosPost = vi.fn()
vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>()
  const axiosActual = typeof actual === 'object' && 'default' in actual ? actual.default : actual
  return {
    default: {
      ...axiosActual,
      post: (...args: unknown[]) => mockAxiosPost(...args),
    },
  }
})

describe('AuthService', () => {
  const mockLoginResponse: LoginResponse = {
    access_token: 'access-token-123',
    refresh_token: 'refresh-token-456',
    expires_in: 3600,
    refresh_expires_in: 86400,
  }

  const mockRefreshResponse: RefreshTokenResponse = {
    access_token: 'new-access-token-789',
    refresh_token: 'new-refresh-token-012',
    expires_in: 3600,
    refresh_expires_in: 86400,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosPost.mockReset()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: mockLoginResponse,
      } as never)

      const credentials = { username: 'user@example.com', password: 'password123' }
      const result = await authService.login(credentials)

      expect(apiClient.post).toHaveBeenCalledWith(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      )
      expect(result).toEqual(mockLoginResponse)
    })

    it('should throw error with invalid credentials', async () => {
      const error = new Error('Invalid credentials')
      vi.mocked(apiClient.post).mockRejectedValueOnce(error)

      const credentials = { username: 'wrong@example.com', password: 'wrongpass' }

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials')
    })

    it('should throw error on network failure', async () => {
      const error = new Error('Network error')
      vi.mocked(apiClient.post).mockRejectedValueOnce(error)

      const credentials = { username: 'user@example.com', password: 'password123' }

      await expect(authService.login(credentials)).rejects.toThrow('Network error')
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      mockAxiosPost.mockResolvedValueOnce({
        data: mockRefreshResponse,
      })

      const result = await authService.refreshToken('old-refresh-token')

      expect(mockAxiosPost).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
        { refresh_token: 'old-refresh-token' },
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' },
          timeout: API_CONFIG.TIMEOUT,
        })
      )
      expect(result).toEqual(mockRefreshResponse)
    })

    it('should throw error with expired refresh token', async () => {
      const error = new Error('Refresh token expired')
      mockAxiosPost.mockRejectedValueOnce(error)

      await expect(authService.refreshToken('expired-token')).rejects.toThrow(
        'Refresh token expired'
      )
    })

    it('should throw error with invalid refresh token', async () => {
      const error = new Error('Invalid refresh token')
      mockAxiosPost.mockRejectedValueOnce(error)

      await expect(authService.refreshToken('invalid-token')).rejects.toThrow(
        'Invalid refresh token'
      )
    })
  })
})
