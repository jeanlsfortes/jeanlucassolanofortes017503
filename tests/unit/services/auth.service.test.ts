import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '@/api/services/auth.service'
import apiClient from '@/@core/interceptors/axios.interceptor'
import type { LoginResponse, RefreshTokenResponse } from '@/api/types/auth.types'

vi.mock('@/@core/interceptors/axios.interceptor')

describe('AuthService', () => {
  const mockLoginResponse: LoginResponse = {
    accessToken: 'access-token-123',
    refreshToken: 'refresh-token-456',
    expiresIn: 3600,
  }

  const mockRefreshResponse: RefreshTokenResponse = {
    accessToken: 'new-access-token-789',
    refreshToken: 'new-refresh-token-012',
    expiresIn: 3600,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockLoginResponse })

      const credentials = { username: 'user@example.com', password: 'password123' }
      const result = await authService.login(credentials)

      expect(apiClient.post).toHaveBeenCalledWith('/autenticacao/login', credentials)
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
      vi.mocked(apiClient.put).mockResolvedValueOnce({ data: mockRefreshResponse })

      const result = await authService.refreshToken('old-refresh-token')

      expect(apiClient.put).toHaveBeenCalledWith('/autenticacao/refresh', {
        refreshToken: 'old-refresh-token',
      })
      expect(result).toEqual(mockRefreshResponse)
    })

    it('should throw error with expired refresh token', async () => {
      const error = new Error('Refresh token expired')
      vi.mocked(apiClient.put).mockRejectedValueOnce(error)

      await expect(authService.refreshToken('expired-token')).rejects.toThrow(
        'Refresh token expired'
      )
    })

    it('should throw error with invalid refresh token', async () => {
      const error = new Error('Invalid refresh token')
      vi.mocked(apiClient.put).mockRejectedValueOnce(error)

      await expect(authService.refreshToken('invalid-token')).rejects.toThrow(
        'Invalid refresh token'
      )
    })
  })
})
