import apiClient from '@/@core/interceptors/axios.interceptor'
import { API_CONFIG } from '@/@core/configs/api.config'
import type {
  Pet,
  PetCreateRequest,
  PetUpdateRequest,
  PetListResponse,
  PetPhotoUpload,
} from '../types/pet.types'

class PetService {
  async list(params?: {
    page?: number
    pageSize?: number
    nome?: string
  }): Promise<PetListResponse> {
    const response = await apiClient.get<PetListResponse>(
      API_CONFIG.ENDPOINTS.PETS.BASE,
      { params }
    )
    return response.data
  }

  async getById(id: string): Promise<Pet> {
    const response = await apiClient.get<Pet>(
      API_CONFIG.ENDPOINTS.PETS.BY_ID(id)
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

  async update(id: string, data: PetUpdateRequest): Promise<Pet> {
    const response = await apiClient.put<Pet>(
      API_CONFIG.ENDPOINTS.PETS.BY_ID(id),
      data
    )
    return response.data
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.PETS.BY_ID(id))
  }

  async uploadPhoto(id: string, photo: PetPhotoUpload): Promise<Pet> {
    const formData = new FormData()
    formData.append('file', photo.file)

    const response = await apiClient.post<Pet>(
      API_CONFIG.ENDPOINTS.PETS.PHOTO(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  }
}

export const petService = new PetService()

