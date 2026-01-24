export interface Tutor {
  id: string
  nomeCompleto: string
  telefone: string
  endereco?: string
  fotoUrl?: string
  pets?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface TutorCreateRequest {
  nomeCompleto: string
  telefone: string
  endereco?: string
}

export interface TutorUpdateRequest {
  nomeCompleto?: string
  telefone?: string
  endereco?: string
}

export interface TutorListResponse {
  data: Tutor[]
  total: number
  page: number
  pageSize: number
}

export interface TutorPhotoUpload {
  file: File
}

