import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tutorFacade } from '@/facades/tutor.facade'
import { tutorService } from '@/api/services/tutor.service'
import type { TutorListResponse, Tutor } from '@/api/types/tutor.types'
import type { Pet } from '@/api/types/pet.types'

vi.mock('@/api/services/tutor.service')

describe('TutorFacade', () => {
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
    tutorFacade.reset()
  })

  describe('state$', () => {
    it('should return an observable', () => {
      expect(tutorFacade.state$.subscribe).toBeDefined()
    })
  })

  describe('currentState', () => {
    it('should return current state snapshot', () => {
      const state = tutorFacade.currentState

      expect(state.tutors).toEqual([])
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('loadTutors', () => {
    it('should load tutors successfully', async () => {
      vi.mocked(tutorService.list).mockResolvedValueOnce(mockListResponse)

      await tutorFacade.loadTutors()

      expect(tutorService.list).toHaveBeenCalledWith(undefined)
      expect(tutorFacade.currentState.tutors).toEqual([mockTutor])
      expect(tutorFacade.currentState.total).toBe(1)
      expect(tutorFacade.currentState.loading).toBe(false)
    })

    it('should load tutors with params', async () => {
      vi.mocked(tutorService.list).mockResolvedValueOnce(mockListResponse)

      const params = { page: 1, size: 10, nome: 'João' }
      await tutorFacade.loadTutors(params)

      expect(tutorService.list).toHaveBeenCalledWith(params)
    })

    it('should set loading state during load', async () => {
      let loadingDuringCall = false
      vi.mocked(tutorService.list).mockImplementationOnce(async () => {
        loadingDuringCall = tutorFacade.currentState.loading
        return mockListResponse
      })

      await tutorFacade.loadTutors()

      expect(loadingDuringCall).toBe(true)
    })

    it('should set error on failure', async () => {
      const error = new Error('Network error')
      vi.mocked(tutorService.list).mockRejectedValueOnce(error)

      await expect(tutorFacade.loadTutors()).rejects.toThrow('Network error')
      expect(tutorFacade.currentState.error).toBe('Network error')
    })
  })

  describe('getTutorById', () => {
    it('should get tutor by id and set as selected', async () => {
      vi.mocked(tutorService.getById).mockResolvedValueOnce(mockTutor)

      const result = await tutorFacade.getTutorById(1)

      expect(tutorService.getById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockTutor)
      expect(tutorFacade.currentState.selectedTutor).toEqual(mockTutor)
    })

    it('should set error on failure', async () => {
      const error = new Error('Tutor not found')
      vi.mocked(tutorService.getById).mockRejectedValueOnce(error)

      await expect(tutorFacade.getTutorById(999)).rejects.toThrow('Tutor not found')
      expect(tutorFacade.currentState.error).toBe('Tutor not found')
    })
  })

  describe('createTutor', () => {
    it('should create tutor and add to state', async () => {
      vi.mocked(tutorService.create).mockResolvedValueOnce(mockTutor)

      const createData = { nome: 'João Silva', email: 'joao@example.com' }
      const result = await tutorFacade.createTutor(createData)

      expect(tutorService.create).toHaveBeenCalledWith(createData)
      expect(result).toEqual(mockTutor)
      expect(tutorFacade.currentState.tutors).toContainEqual(mockTutor)
    })

    it('should set error on failure', async () => {
      const error = new Error('Validation error')
      vi.mocked(tutorService.create).mockRejectedValueOnce(error)

      await expect(tutorFacade.createTutor({ nome: '' })).rejects.toThrow('Validation error')
      expect(tutorFacade.currentState.error).toBe('Validation error')
    })
  })

  describe('updateTutor', () => {
    it('should update tutor in state', async () => {
      // First add the tutor
      vi.mocked(tutorService.list).mockResolvedValueOnce(mockListResponse)
      await tutorFacade.loadTutors()

      // Then update it
      const updatedTutor = { ...mockTutor, nome: 'João Silva Updated' }
      vi.mocked(tutorService.update).mockResolvedValueOnce(updatedTutor)

      const result = await tutorFacade.updateTutor(1, { nome: 'João Silva Updated' })

      expect(tutorService.update).toHaveBeenCalledWith(1, { nome: 'João Silva Updated' })
      expect(result).toEqual(updatedTutor)
      expect(tutorFacade.currentState.tutors[0].nome).toBe('João Silva Updated')
    })
  })

  describe('deleteTutor', () => {
    it('should delete tutor from state', async () => {
      // First add the tutor
      vi.mocked(tutorService.list).mockResolvedValueOnce(mockListResponse)
      await tutorFacade.loadTutors()
      expect(tutorFacade.currentState.tutors).toHaveLength(1)

      // Then delete it
      vi.mocked(tutorService.delete).mockResolvedValueOnce(undefined)

      await tutorFacade.deleteTutor(1)

      expect(tutorService.delete).toHaveBeenCalledWith(1)
      expect(tutorFacade.currentState.tutors).toHaveLength(0)
    })
  })

  describe('uploadPhoto', () => {
    it('should upload photo and update tutor', async () => {
      // First add the tutor
      vi.mocked(tutorService.list).mockResolvedValueOnce(mockListResponse)
      await tutorFacade.loadTutors()

      // Then upload photo
      const tutorWithPhoto = {
        ...mockTutor,
        foto: { id: 1, nome: 'photo.jpg', contentType: 'image/jpeg', url: 'http://...' },
      }
      vi.mocked(tutorService.uploadPhoto).mockResolvedValueOnce(tutorWithPhoto)

      const file = new File([''], 'photo.jpg', { type: 'image/jpeg' })
      const result = await tutorFacade.uploadPhoto(1, { file })

      expect(result).toEqual(tutorWithPhoto)
    })
  })

  describe('linkPet', () => {
    it('should link pet to tutor', async () => {
      vi.mocked(tutorService.linkPet).mockResolvedValueOnce(undefined)
      vi.mocked(tutorService.getById).mockResolvedValueOnce({
        ...mockTutor,
        pets: [mockPet],
      })

      await tutorFacade.linkPet(1, 2)

      expect(tutorService.linkPet).toHaveBeenCalledWith(1, 2)
    })

    it('should set error on failure', async () => {
      const error = new Error('Link error')
      vi.mocked(tutorService.linkPet).mockRejectedValueOnce(error)

      await expect(tutorFacade.linkPet(1, 2)).rejects.toThrow('Link error')
      expect(tutorFacade.currentState.error).toBe('Link error')
    })
  })

  describe('unlinkPet', () => {
    it('should unlink pet from tutor', async () => {
      vi.mocked(tutorService.unlinkPet).mockResolvedValueOnce(undefined)

      await tutorFacade.unlinkPet(1, 2)

      expect(tutorService.unlinkPet).toHaveBeenCalledWith(1, 2)
    })
  })

  describe('getTutorPets', () => {
    it('should get pets for tutor', async () => {
      vi.mocked(tutorService.getPets).mockResolvedValueOnce([mockPet])

      const result = await tutorFacade.getTutorPets(1)

      expect(tutorService.getPets).toHaveBeenCalledWith(1)
      expect(result).toEqual([mockPet])
    })
  })

  describe('selectTutor', () => {
    it('should set selected tutor', () => {
      tutorFacade.selectTutor(mockTutor)

      expect(tutorFacade.currentState.selectedTutor).toEqual(mockTutor)
    })

    it('should clear selected tutor', () => {
      tutorFacade.selectTutor(mockTutor)
      tutorFacade.selectTutor(null)

      expect(tutorFacade.currentState.selectedTutor).toBeNull()
    })
  })

  describe('clearError', () => {
    it('should clear error', async () => {
      const error = new Error('Error')
      vi.mocked(tutorService.list).mockRejectedValueOnce(error)

      try {
        await tutorFacade.loadTutors()
      } catch {}

      expect(tutorFacade.currentState.error).not.toBeNull()

      tutorFacade.clearError()

      expect(tutorFacade.currentState.error).toBeNull()
    })
  })

  describe('reset', () => {
    it('should reset to initial state', async () => {
      vi.mocked(tutorService.list).mockResolvedValueOnce(mockListResponse)
      await tutorFacade.loadTutors()
      tutorFacade.selectTutor(mockTutor)

      expect(tutorFacade.currentState.tutors).toHaveLength(1)
      expect(tutorFacade.currentState.selectedTutor).not.toBeNull()

      tutorFacade.reset()

      expect(tutorFacade.currentState.tutors).toHaveLength(0)
      expect(tutorFacade.currentState.selectedTutor).toBeNull()
      expect(tutorFacade.currentState.loading).toBe(false)
      expect(tutorFacade.currentState.error).toBeNull()
    })
  })
})
