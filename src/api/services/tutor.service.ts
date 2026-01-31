import apiClient from '@/@core/interceptors/axios.interceptor'
import { API_CONFIG } from '@/@core/configs/api.config'
import type { Pet } from '../types/pet.types'
import type {
  Tutor,
  TutorCreateRequest,
  TutorUpdateRequest,
  TutorListResponse,
  TutorListParams,
  TutorPhotoUpload,
} from '../types/tutor.types'

/**
 * Validates that an ID is a positive integer
 */
function validateId(id: number, paramName: string = 'id'): void {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid ${paramName}: must be a positive integer`)
  }
}

/**
 * Validates pagination parameters (page is 0-based)
 */
function validatePaginationParams(params?: TutorListParams): void {
  if (params) {
    if (params.page !== undefined && (params.page < 0 || !Number.isInteger(params.page))) {
      throw new Error('Invalid page: must be a non-negative integer')
    }
    if (params.size !== undefined && (params.size < 1 || !Number.isInteger(params.size))) {
      throw new Error('Invalid size: must be a positive integer')
    }
  }
}

/**
 * Validates photo file
 */
function validatePhotoFile(file: File): void {
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

  if (!file) {
    throw new Error('Photo file is required')
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds maximum allowed size of 5MB')
  }
}

function normalizeListResponse(raw: unknown): TutorListResponse {
  const r = raw as Record<string, unknown>
  const total = (r.totalElements ?? r.total ?? 0) as number
  const size = (r.size ?? 10) as number
  const pageCount = (r.totalPages ?? r.pageCount ?? Math.max(1, Math.ceil(total / size))) as number
  const content = (r.content ?? []) as Tutor[]
  const page = (r.number ?? r.page ?? 0) as number
  return { page, size, total, pageCount, content }
}

class TutorService {
  async list(params?: TutorListParams): Promise<TutorListResponse> {
    validatePaginationParams(params)
    const response = await apiClient.get<unknown>(
      API_CONFIG.ENDPOINTS.TUTORES.BASE,
      { params }
    )
    return normalizeListResponse(response.data)
  }

  async getById(id: number): Promise<Tutor> {
    validateId(id, 'tutorId')
    const response = await apiClient.get<Tutor>(
      API_CONFIG.ENDPOINTS.TUTORES.BY_ID(String(id))
    )
    return response.data
  }

  async create(data: TutorCreateRequest): Promise<Tutor> {
    const response = await apiClient.post<Tutor>(
      API_CONFIG.ENDPOINTS.TUTORES.BASE,
      data
    )
    return response.data
  }

  async update(id: number, data: TutorUpdateRequest): Promise<Tutor> {
    validateId(id, 'tutorId')
    const response = await apiClient.put<Tutor>(
      API_CONFIG.ENDPOINTS.TUTORES.BY_ID(String(id)),
      data
    )
    return response.data
  }

  async delete(id: number): Promise<void> {
    validateId(id, 'tutorId')
    await apiClient.delete(API_CONFIG.ENDPOINTS.TUTORES.BY_ID(String(id)))
  }

  async uploadPhoto(id: number, photo: TutorPhotoUpload): Promise<Tutor> {
    validateId(id, 'tutorId')
    validatePhotoFile(photo.file)

    const formData = new FormData()
    formData.append('foto', photo.file)

    const response = await apiClient.post<Tutor>(
      API_CONFIG.ENDPOINTS.TUTORES.PHOTO(String(id)),
      formData
    )
    return response.data
  }

  async linkPet(tutorId: number, petId: number): Promise<void> {
    validateId(tutorId, 'tutorId')
    validateId(petId, 'petId')
    await apiClient.post(
      API_CONFIG.ENDPOINTS.TUTORES.LINK_PET(String(tutorId), String(petId))
    )
  }

  async unlinkPet(tutorId: number, petId: number): Promise<void> {
    validateId(tutorId, 'tutorId')
    validateId(petId, 'petId')
    await apiClient.delete(
      API_CONFIG.ENDPOINTS.TUTORES.LINK_PET(String(tutorId), String(petId))
    )
  }

  async getPets(tutorId: number): Promise<Pet[]> {
    validateId(tutorId, 'tutorId')
    const response = await apiClient.get<Pet[]>(
      API_CONFIG.ENDPOINTS.TUTORES.PETS(String(tutorId))
    )
    return response.data
  }
}

export const tutorService = new TutorService()

