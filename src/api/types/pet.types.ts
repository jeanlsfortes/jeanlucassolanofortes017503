export interface Pet {
  id: string
  nome: string
  especie: string
  raca?: string
  idade?: number
  fotoUrl?: string
  tutorId?: string
  createdAt?: string
  updatedAt?: string
}

export interface PetCreateRequest {
  nome: string
  especie: string
  raca?: string
  idade?: number
}

export interface PetUpdateRequest {
  nome?: string
  especie?: string
  raca?: string
  idade?: number
}

export interface PetListResponse {
  data: Pet[]
  total: number
  page: number
  pageSize: number
}

export interface PetPhotoUpload {
  file: File
}

