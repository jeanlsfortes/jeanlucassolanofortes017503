import apiClient from '@/@core/interceptors/axios.interceptor'
import { API_CONFIG } from '@/@core/configs/api.config'
import type {
  Pet,
  PetDetail,
  PetCreateRequest,
  PetUpdateRequest,
  PetListResponse,
  PetListParams,
  PetPhotoUpload,
} from '../types/pet.types'

function normalizeListResponse(raw: unknown): PetListResponse {
  const r = raw as Record<string, unknown>
  const total = (r.totalElements ?? r.total ?? 0) as number
  const size = (r.size ?? 10) as number
  const pageCount = (r.totalPages ?? r.pageCount ?? Math.max(1, Math.ceil(total / size))) as number
  const content = (r.content ?? []) as Pet[]
  const page = (r.number ?? r.page ?? 0) as number
  return { page, size, total, pageCount, content }
}

class PetService {
  async list(params?: PetListParams): Promise<PetListResponse> {
    const response = await apiClient.get<unknown>(
      API_CONFIG.ENDPOINTS.PETS.BASE,
      { params }
    )
    return normalizeListResponse(response.data)
  }

  async getById(id: number): Promise<PetDetail> {
    const response = await apiClient.get<PetDetail>(
      API_CONFIG.ENDPOINTS.PETS.BY_ID(String(id))
    )
    return response.data
  }

  async create(data: PetCreateRequest): Promise<Pet> {
    const response = await apiClient.post<Pet>(
      API_CONFIG.ENDPOINTS.PETS.BASE,
      data
    )
    return response.data
  }

  async update(id: number, data: PetUpdateRequest): Promise<Pet> {
    const response = await apiClient.put<Pet>(
      API_CONFIG.ENDPOINTS.PETS.BY_ID(String(id)),
      data
    )
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.PETS.BY_ID(String(id)))
  }

  async uploadPhoto(id: number, photo: PetPhotoUpload): Promise<Pet> {
    const formData = new FormData()
    formData.append('foto', photo.file)

    const response = await apiClient.post<Pet>(
      API_CONFIG.ENDPOINTS.PETS.PHOTO(String(id)),
      formData
    )
    return response.data
  }
}

export const petService = new PetService()

