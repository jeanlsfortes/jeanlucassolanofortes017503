import type { Pet, PetPhoto } from './pet.types'

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
  cpf?: number
  foto?: TutorPhoto
  pets?: Pet[]
}

export interface TutorCreateRequest {
  nome: string
  email?: string
  telefone?: string
  endereco?: string
  cpf?: number
}

export interface TutorUpdateRequest {
  nome?: string
  email?: string
  telefone?: string
  endereco?: string
  cpf?: number
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

