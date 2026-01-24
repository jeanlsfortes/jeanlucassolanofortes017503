import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  token: string | null
  refreshToken: string | null
  expiration: string | null
  user: {
    id: string
    email: string
    name: string
  } | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  setRefreshToken: (refreshToken: string) => void
  setExpiration: (expiration: string) => void
  setUser: (user: { id: string; email: string; name: string }) => void
  login: (data: {
    token: string
    refreshToken: string
    expiration: string
    user: { id: string; email: string; name: string }
  }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      expiration: null,
      user: null,
      isAuthenticated: false,

      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setExpiration: (expiration) => set({ expiration }),
      setUser: (user) => set({ user }),

      login: (data) =>
        set({
          token: data.token,
          refreshToken: data.refreshToken,
          expiration: data.expiration,
          user: data.user,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          refreshToken: null,
          expiration: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

