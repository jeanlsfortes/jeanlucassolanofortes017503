import { describe, it, expect, vi, beforeEach } from 'vitest'
import { petFacade } from '@/facades/pet.facade'
import { petService } from '@/api/services/pet.service'
import { petState$, petStateActions } from '@/state/pet.state'
import type { PetListResponse, Pet, PetDetail } from '@/api/types/pet.types'

vi.mock('@/api/services/pet.service')

describe('PetFacade', () => {
  const mockPet: Pet = {
    id: 1,
    nome: 'Rex',
    raca: 'Labrador',
    idade: 3,
  }

  const mockPetDetail: PetDetail = {
    ...mockPet,
    tutores: [{ id: 1, nome: 'João' }],
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
    petFacade.reset()
  })

  describe('state$', () => {
    it('should return an observable', () => {
      expect(petFacade.state$.subscribe).toBeDefined()
    })
  })

  describe('currentState', () => {
    it('should return current state snapshot', () => {
      const state = petFacade.currentState

      expect(state.pets).toEqual([])
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('loadPets', () => {
    it('should load pets successfully', async () => {
      vi.mocked(petService.list).mockResolvedValueOnce(mockListResponse)

      await petFacade.loadPets()

      expect(petService.list).toHaveBeenCalledWith(undefined)
      expect(petFacade.currentState.pets).toEqual([mockPet])
      expect(petFacade.currentState.total).toBe(1)
      expect(petFacade.currentState.loading).toBe(false)
    })

    it('should load pets with params', async () => {
      vi.mocked(petService.list).mockResolvedValueOnce(mockListResponse)

      const params = { page: 1, size: 10, nome: 'Rex' }
      await petFacade.loadPets(params)

      expect(petService.list).toHaveBeenCalledWith(params)
    })

    it('should set loading state during load', async () => {
      let loadingDuringCall = false
      vi.mocked(petService.list).mockImplementationOnce(async () => {
        loadingDuringCall = petFacade.currentState.loading
        return mockListResponse
      })

      await petFacade.loadPets()

      expect(loadingDuringCall).toBe(true)
    })

    it('should set error on failure', async () => {
      const error = new Error('Network error')
      vi.mocked(petService.list).mockRejectedValueOnce(error)

      await expect(petFacade.loadPets()).rejects.toThrow('Network error')
      expect(petFacade.currentState.error).toBe('Network error')
    })
  })

  describe('getPetById', () => {
    it('should get pet by id and set as selected', async () => {
      vi.mocked(petService.getById).mockResolvedValueOnce(mockPetDetail)

      const result = await petFacade.getPetById(1)

      expect(petService.getById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockPetDetail)
      expect(petFacade.currentState.selectedPet).toEqual(mockPetDetail)
    })

    it('should set error on failure', async () => {
      const error = new Error('Pet not found')
      vi.mocked(petService.getById).mockRejectedValueOnce(error)

      await expect(petFacade.getPetById(999)).rejects.toThrow('Pet not found')
      expect(petFacade.currentState.error).toBe('Pet not found')
    })
  })

  describe('createPet', () => {
    it('should create pet and add to state', async () => {
      vi.mocked(petService.create).mockResolvedValueOnce(mockPet)

      const createData = { nome: 'Rex', raca: 'Labrador', idade: 3 }
      const result = await petFacade.createPet(createData)

      expect(petService.create).toHaveBeenCalledWith(createData)
      expect(result).toEqual(mockPet)
      expect(petFacade.currentState.pets).toContainEqual(mockPet)
    })

    it('should set error on failure', async () => {
      const error = new Error('Validation error')
      vi.mocked(petService.create).mockRejectedValueOnce(error)

      await expect(petFacade.createPet({ nome: '' })).rejects.toThrow('Validation error')
      expect(petFacade.currentState.error).toBe('Validation error')
    })
  })

  describe('updatePet', () => {
    it('should update pet in state', async () => {
      // First add the pet
      vi.mocked(petService.list).mockResolvedValueOnce(mockListResponse)
      await petFacade.loadPets()

      // Then update it
      const updatedPet = { ...mockPet, nome: 'Rex Updated' }
      vi.mocked(petService.update).mockResolvedValueOnce(updatedPet)

      const result = await petFacade.updatePet(1, { nome: 'Rex Updated' })

      expect(petService.update).toHaveBeenCalledWith(1, { nome: 'Rex Updated' })
      expect(result).toEqual(updatedPet)
      expect(petFacade.currentState.pets[0].nome).toBe('Rex Updated')
    })
  })

  describe('deletePet', () => {
    it('should delete pet from state', async () => {
      // First add the pet
      vi.mocked(petService.list).mockResolvedValueOnce(mockListResponse)
      await petFacade.loadPets()
      expect(petFacade.currentState.pets).toHaveLength(1)

      // Then delete it
      vi.mocked(petService.delete).mockResolvedValueOnce(undefined)

      await petFacade.deletePet(1)

      expect(petService.delete).toHaveBeenCalledWith(1)
      expect(petFacade.currentState.pets).toHaveLength(0)
    })
  })

  describe('uploadPhoto', () => {
    it('should upload photo and update pet', async () => {
      // First add the pet
      vi.mocked(petService.list).mockResolvedValueOnce(mockListResponse)
      await petFacade.loadPets()

      // Then upload photo
      const petWithPhoto = {
        ...mockPet,
        foto: { id: 1, nome: 'photo.jpg', contentType: 'image/jpeg', url: 'http://...' },
      }
      vi.mocked(petService.uploadPhoto).mockResolvedValueOnce(petWithPhoto)

      const file = new File([''], 'photo.jpg', { type: 'image/jpeg' })
      const result = await petFacade.uploadPhoto(1, { file })

      expect(result).toEqual(petWithPhoto)
    })
  })

  describe('selectPet', () => {
    it('should set selected pet', () => {
      petFacade.selectPet(mockPet)

      expect(petFacade.currentState.selectedPet).toEqual(mockPet)
    })

    it('should clear selected pet', () => {
      petFacade.selectPet(mockPet)
      petFacade.selectPet(null)

      expect(petFacade.currentState.selectedPet).toBeNull()
    })
  })

  describe('clearError', () => {
    it('should clear error', async () => {
      const error = new Error('Error')
      vi.mocked(petService.list).mockRejectedValueOnce(error)

      try {
        await petFacade.loadPets()
      } catch {}

      expect(petFacade.currentState.error).not.toBeNull()

      petFacade.clearError()

      expect(petFacade.currentState.error).toBeNull()
    })
  })

  describe('reset', () => {
    it('should reset to initial state', async () => {
      vi.mocked(petService.list).mockResolvedValueOnce(mockListResponse)
      await petFacade.loadPets()
      petFacade.selectPet(mockPet)

      expect(petFacade.currentState.pets).toHaveLength(1)
      expect(petFacade.currentState.selectedPet).not.toBeNull()

      petFacade.reset()

      expect(petFacade.currentState.pets).toHaveLength(0)
      expect(petFacade.currentState.selectedPet).toBeNull()
      expect(petFacade.currentState.loading).toBe(false)
      expect(petFacade.currentState.error).toBeNull()
    })
  })
})
