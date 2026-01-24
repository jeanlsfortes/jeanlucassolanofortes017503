import apiClient from '@/@core/interceptors/axios.interceptor'
import { API_CONFIG } from '@/@core/configs/api.config'
import type {
  Tutor,
  TutorCreateRequest,
  TutorUpdateRequest,
  TutorListResponse,
  TutorPhotoUpload,
} from '../types/tutor.types'

class TutorService {
  async list(params?: {
    page?: number
    pageSize?: number
  }): Promise<TutorListResponse> {
    const response = await apiClient.get<TutorListResponse>(
      API_CONFIG.ENDPOINTS.TUTORES.BASE,
      { params }
    )
    return response.data
  }

  async getById(id: string): Promise<Tutor> {
    const response = await apiClient.get<Tutor>(
      API_CONFIG.ENDPOINTS.TUTORES.BY_ID(id)
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

  async update(id: string, data: TutorUpdateRequest): Promise<Tutor> {
    const response = await apiClient.put<Tutor>(
      API_CONFIG.ENDPOINTS.TUTORES.BY_ID(id),
      data
    )
    return response.data
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.TUTORES.BY_ID(id))
  }

  async uploadPhoto(id: string, photo: TutorPhotoUpload): Promise<Tutor> {
    const formData = new FormData()
    formData.append('file', photo.file)

    const response = await apiClient.post<Tutor>(
      API_CONFIG.ENDPOINTS.TUTORES.PHOTO(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  }

  async linkPet(tutorId: string, petId: string): Promise<void> {
    await apiClient.post(
      API_CONFIG.ENDPOINTS.TUTORES.LINK_PET(tutorId, petId)
    )
  }

  async unlinkPet(tutorId: string, petId: string): Promise<void> {
    await apiClient.delete(
      API_CONFIG.ENDPOINTS.TUTORES.LINK_PET(tutorId, petId)
    )
  }

  async getPets(tutorId: string): Promise<string[]> {
    const response = await apiClient.get<string[]>(
      API_CONFIG.ENDPOINTS.TUTORES.PETS(tutorId)
    )
    return response.data
  }
}

export const tutorService = new TutorService()

