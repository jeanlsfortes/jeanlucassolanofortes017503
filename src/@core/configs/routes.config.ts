export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PETS: {
    LIST: '/pets',
    DETAIL: (id: string) => `/pets/${id}`,
    NEW: '/pets/new',
    EDIT: (id: string) => `/pets/${id}/edit`,
  },
  TUTORES: {
    LIST: '/tutores',
    DETAIL: (id: string) => `/tutores/${id}`,
    NEW: '/tutores/new',
    EDIT: (id: string) => `/tutores/${id}/edit`,
  },
} as const

