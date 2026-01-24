export interface PetPhoto {
  id: number
  nome: string
  contentType: string
  url: string
}

export interface Pet {
  id: number
  nome: string
  raca?: string
  idade?: number
  foto?: PetPhoto
}

export interface TutorEmbed {
  id: number
  nome: string
  email?: string
  telefone?: string
  endereco?: string
  cpf?: number
  foto?: PetPhoto
}

export interface PetDetail extends Pet {
  tutores?: TutorEmbed[]
}

export interface PetCreateRequest {
  nome: string
  raca?: string
  idade?: number
}

export interface PetUpdateRequest {
  nome?: string
  raca?: string
  idade?: number
}

export interface PetListResponse {
  page: number
  size: number
  total: number
  pageCount: number
  content: Pet[]
}

export interface PetListParams {
  page?: number
  size?: number
  nome?: string
  raca?: string
}

export interface PetPhotoUpload {
  file: File
}

