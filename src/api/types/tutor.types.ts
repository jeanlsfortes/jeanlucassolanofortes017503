import type { Pet } from './pet.types'

export interface TutorPhoto {
  id: number
  nome: string
  contentType: string
  url: string
}

export interface Tutor {
  id: number
  nome: string
  email?: string
  telefone?: string
  endereco?: string
  cpf?: string
  foto?: TutorPhoto
  pets?: Pet[]
}

export interface TutorCreateRequest {
  nome: string
  email?: string
  telefone?: string
  endereco?: string
  cpf?: string
}

export interface TutorUpdateRequest {
  nome?: string
  email?: string
  telefone?: string
  endereco?: string
  cpf?: string
}

export interface TutorListParams {
  page?: number
  size?: number
  nome?: string
}

export interface TutorListResponse {
  page: number
  size: number
  total: number
  pageCount: number
  content: Tutor[]
}

export interface TutorPhotoUpload {
  file: File
}

