import apiClient from '@/@core/interceptors/axios.interceptor'
import { API_CONFIG } from '@/@core/configs/api.config'
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '../types/auth.types'

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    return response.data
  }

  async refreshToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    const response = await apiClient.put<RefreshTokenResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REFRESH,
      { refreshToken } as RefreshTokenRequest
    )
    return response.data
  }
}

export const authService = new AuthService()

