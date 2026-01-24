import apiClient from '@/@core/interceptors/axios.interceptor'
import { API_CONFIG } from '@/@core/configs/api.config'
import type { Pet } from '../types/pet.types'
import type {
  Tutor,
  TutorCreateRequest,
  TutorUpdateRequest,
  TutorListResponse,
  TutorPhotoUpload,
} from '../types/tutor.types'

export interface TutorListParams {
  page?: number
  size?: number
  nome?: string
}

class TutorService {
  async list(params?: TutorListParams): Promise<TutorListResponse> {
    const response = await apiClient.get<TutorListResponse>(
      API_CONFIG.ENDPOINTS.TUTORES.BASE,
      { params }
    )
    return response.data
  }

  async getById(id: number): Promise<Tutor> {
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
    const response = await apiClient.put<Tutor>(
      API_CONFIG.ENDPOINTS.TUTORES.BY_ID(String(id)),
      data
    )
    return response.data
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.TUTORES.BY_ID(String(id)))
  }

  async uploadPhoto(id: number, photo: TutorPhotoUpload): Promise<Tutor> {
    const formData = new FormData()
    formData.append('file', photo.file)

    const response = await apiClient.post<Tutor>(
      API_CONFIG.ENDPOINTS.TUTORES.PHOTO(String(id)),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  }

  async linkPet(tutorId: number, petId: number): Promise<void> {
    await apiClient.post(
      API_CONFIG.ENDPOINTS.TUTORES.LINK_PET(String(tutorId), String(petId))
    )
  }

  async unlinkPet(tutorId: number, petId: number): Promise<void> {
    await apiClient.delete(
      API_CONFIG.ENDPOINTS.TUTORES.LINK_PET(String(tutorId), String(petId))
    )
  }

  async getPets(tutorId: number): Promise<Pet[]> {
    const response = await apiClient.get<Pet[]>(
      API_CONFIG.ENDPOINTS.TUTORES.PETS(String(tutorId))
    )
    return response.data
  }
}

export const tutorService = new TutorService()

