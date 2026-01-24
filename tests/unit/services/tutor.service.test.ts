import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tutorService } from '@/api/services/tutor.service'
import apiClient from '@/@core/interceptors/axios.interceptor'
import type { Tutor, TutorListResponse } from '@/api/types/tutor.types'
import type { Pet } from '@/api/types/pet.types'

vi.mock('@/@core/interceptors/axios.interceptor')

describe('TutorService', () => {
  const mockTutor: Tutor = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@example.com',
    telefone: '11999999999',
    endereco: 'Rua Teste, 123',
    cpf: 12345678901,
  }

  const mockPet: Pet = {
    id: 1,
    nome: 'Rex',
    raca: 'Labrador',
    idade: 3,
  }

  const mockListResponse: TutorListResponse = {
    page: 1,
    size: 10,
    total: 1,
    pageCount: 1,
    content: [mockTutor],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('should list tutors without params', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockListResponse })

      const result = await tutorService.list()

      expect(apiClient.get).toHaveBeenCalledWith('/v1/tutores', { params: undefined })
      expect(result).toEqual(mockListResponse)
    })

    it('should list tutors with params', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockListResponse })

      const params = { page: 1, size: 10, nome: 'João' }
      const result = await tutorService.list(params)

      expect(apiClient.get).toHaveBeenCalledWith('/v1/tutores', { params })
      expect(result).toEqual(mockListResponse)
    })

    it('should throw error on failure', async () => {
      const error = new Error('Network error')
      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      await expect(tutorService.list()).rejects.toThrow('Network error')
    })
  })

  describe('getById', () => {
    it('should get tutor by id', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockTutor })

      const result = await tutorService.getById(1)

      expect(apiClient.get).toHaveBeenCalledWith('/v1/tutores/1')
      expect(result).toEqual(mockTutor)
    })

    it('should throw error when tutor not found', async () => {
      const error = new Error('Tutor not found')
      vi.mocked(apiClient.get).mockRejectedValueOnce(error)

      await expect(tutorService.getById(999)).rejects.toThrow('Tutor not found')
    })
  })

  describe('create', () => {
    it('should create a tutor', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockTutor })

      const createData = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '11999999999',
      }
      const result = await tutorService.create(createData)

      expect(apiClient.post).toHaveBeenCalledWith('/v1/tutores', createData)
      expect(result).toEqual(mockTutor)
    })

    it('should throw error on creation failure', async () => {
      const error = new Error('Validation error')
      vi.mocked(apiClient.post).mockRejectedValueOnce(error)

      await expect(tutorService.create({ nome: '' })).rejects.toThrow('Validation error')
    })
  })

  describe('update', () => {
    it('should update a tutor', async () => {
      const updatedTutor = { ...mockTutor, nome: 'João Silva Updated' }
      vi.mocked(apiClient.put).mockResolvedValueOnce({ data: updatedTutor })

      const updateData = { nome: 'João Silva Updated' }
      const result = await tutorService.update(1, updateData)

      expect(apiClient.put).toHaveBeenCalledWith('/v1/tutores/1', updateData)
      expect(result).toEqual(updatedTutor)
    })
  })

  describe('delete', () => {
    it('should delete a tutor', async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({})

      await tutorService.delete(1)

      expect(apiClient.delete).toHaveBeenCalledWith('/v1/tutores/1')
    })

    it('should throw error on deletion failure', async () => {
      const error = new Error('Cannot delete')
      vi.mocked(apiClient.delete).mockRejectedValueOnce(error)

      await expect(tutorService.delete(1)).rejects.toThrow('Cannot delete')
    })
  })

  describe('uploadPhoto', () => {
    it('should upload a photo', async () => {
      const tutorWithPhoto = {
        ...mockTutor,
        foto: { id: 1, nome: 'photo.jpg', contentType: 'image/jpeg', url: 'http://...' },
      }
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: tutorWithPhoto })

      const file = new File([''], 'photo.jpg', { type: 'image/jpeg' })
      const result = await tutorService.uploadPhoto(1, { file })

      expect(apiClient.post).toHaveBeenCalledWith(
        '/v1/tutores/1/fotos',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual(tutorWithPhoto)
    })
  })

  describe('linkPet', () => {
    it('should link a pet to a tutor', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({})

      await tutorService.linkPet(1, 2)

      expect(apiClient.post).toHaveBeenCalledWith('/v1/tutores/1/pets/2')
    })
  })

  describe('unlinkPet', () => {
    it('should unlink a pet from a tutor', async () => {
      vi.mocked(apiClient.delete).mockResolvedValueOnce({})

      await tutorService.unlinkPet(1, 2)

      expect(apiClient.delete).toHaveBeenCalledWith('/v1/tutores/1/pets/2')
    })
  })

  describe('getPets', () => {
    it('should get pets for a tutor', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [mockPet] })

      const result = await tutorService.getPets(1)

      expect(apiClient.get).toHaveBeenCalledWith('/v1/tutores/1/pets')
      expect(result).toEqual([mockPet])
    })
  })
})
