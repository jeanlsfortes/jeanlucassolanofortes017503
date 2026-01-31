export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://pet-manager-api.geia.vip',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/autenticacao/login',
      REFRESH: '/autenticacao/refresh',
    },
    HEALTH: {
      LIVE: '/health/live',
      READY: '/health/ready',
      BASE: '/health',
    },
    PETS: {
      BASE: '/v1/pets',
      BY_ID: (id: string) => `/v1/pets/${id}`,
      PHOTO: (id: string) => `/v1/pets/${id}/fotos`,
    },
    TUTORES: {
      BASE: '/v1/tutores',
      BY_ID: (id: string) => `/v1/tutores/${id}`,
      PHOTO: (id: string) => `/v1/tutores/${id}/fotos`,
      PETS: (id: string) => `/v1/tutores/${id}/pets`,
      LINK_PET: (tutorId: string, petId: string) => `/v1/tutores/${tutorId}/pets/${petId}`,
    },
  },
} as const

