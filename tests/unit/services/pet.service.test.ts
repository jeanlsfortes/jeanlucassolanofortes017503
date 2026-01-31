import { describe, it, expect, vi, beforeEach } from 'vitest'
import { petService } from '@/api/services/pet.service'
import apiClient from '@/@core/interceptors/axios.interceptor'
import type { Pet, PetListResponse, PetDetail } from '@/api/types/pet.types'

vi.mock('@/@core/interceptors/axios.interceptor')

describe('PetService', () => {
  const mockPet: Pet = {
    id: 1,
    nome: 'Rex',
    raca: 'Labrador',
    idade: 3,
  }

  const mockPetDetail: PetDetail = {
    ...mockPet,
    tutores: [
      { id: 1, nome: 'João' },
    ],
  }

  const mockListResponse: PetListResponse = {
    page: 1,
    size: 10,
    total: 1,
    pageCount: 1,
    content: [mockPet],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('should list pets without params', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockListResponse })

      const result = await petService.list()

      expect(apiClient.get).toHaveBeenCalledWith('/v1/pets', { params: undefined })
      expect(result).toEqual(mockListResponse)
    })

    it('should list pets with params', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockListResponse })

      const params = { page: 1, size: 10, nome: 'Rex' }
      const result = await petService.list(params)

      expect(apiClient.get).toHaveBeenCalledWith('/v1/pets', { params })
      expect(result).toEqual(mockListResponse)
    })

    it('should throw error on failure', async () => {
      const error = new Error('Network error')
      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      await expect(petService.list()).rejects.toThrow('Network error')
    })
  })

  describe('getById', () => {
    it('should get pet by id', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockPetDetail })

      const result = await petService.getById(1)

      expect(apiClient.get).toHaveBeenCalledWith('/v1/pets/1')
      expect(result).toEqual(mockPetDetail)
    })

    it('should throw error when pet not found', async () => {
      const error = new Error('Pet not found')
      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      await expect(petService.getById(999)).rejects.toThrow('Pet not found')
    })
  })

  describe('create', () => {
    it('should create a pet', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockPet })

      const createData = { nome: 'Rex', raca: 'Labrador', idade: 3 }
      const result = await petService.create(createData)

      expect(apiClient.post).toHaveBeenCalledWith('/v1/pets', createData)
      expect(result).toEqual(mockPet)
    })

    it('should throw error on creation failure', async () => {
      const error = new Error('Validation error')
      vi.mocked(apiClient.post).mockRejectedValueOnce(error)

      await expect(petService.create({ nome: '' })).rejects.toThrow('Validation error')
    })
  })

  describe('update', () => {
    it('should update a pet', async () => {
      const updatedPet = { ...mockPet, nome: 'Rex Updated' }
      vi.mocked(apiClient.put).mockResolvedValueOnce({ data: updatedPet })

      const updateData = { nome: 'Rex Updated' }
      const result = await petService.update(1, updateData)

      expect(apiClient.put).toHaveBeenCalledWith('/v1/pets/1', updateData)
      expect(result).toEqual(updatedPet)
    })
  })

  describe('delete', () => {
    it('should delete a pet', async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({})

      await petService.delete(1)

      expect(apiClient.delete).toHaveBeenCalledWith('/v1/pets/1')
    })

    it('should throw error on deletion failure', async () => {
      const error = new Error('Cannot delete')
      vi.mocked(apiClient.delete).mockRejectedValueOnce(error)

      await expect(petService.delete(1)).rejects.toThrow('Cannot delete')
    })
  })

  describe('uploadPhoto', () => {
    it('should upload a photo', async () => {
      const petWithPhoto = { ...mockPet, foto: { id: 1, nome: 'photo.jpg', contentType: 'image/jpeg', url: 'http://...' } }
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: petWithPhoto })

      const file = new File([''], 'photo.jpg', { type: 'image/jpeg' })
      const result = await petService.uploadPhoto(1, { file })

      expect(apiClient.post).toHaveBeenCalledWith(
        '/v1/pets/1/fotos',
        expect.any(FormData)
      )
      expect(result).toEqual(petWithPhoto)
    })
  })
})
