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
}

export interface PetPhotoUpload {
  file: File
}

