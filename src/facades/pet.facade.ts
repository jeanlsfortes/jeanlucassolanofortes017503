import { Observable } from 'rxjs'
import { petService } from '@/api/services/pet.service'
import { petState$, petStateActions, type PetState } from '@/state/pet.state'
import type {
  Pet,
  PetDetail,
  PetListParams,
  PetCreateRequest,
  PetUpdateRequest,
  PetPhotoUpload,
} from '@/api/types/pet.types'

/**
 * PetFacade - Provides a unified interface for pet operations
 * Combines service calls with reactive state management
 */
class PetFacade {
  /**
   * Get pet state as Observable (reactive)
   */
  get state$(): Observable<PetState> {
    return petState$.asObservable()
  }

  /**
   * Get current pet state (snapshot)
   */
  get currentState(): PetState {
    return petState$.getValue()
  }

  /**
   * Load pets with optional filters
   */
  async loadPets(params?: PetListParams): Promise<void> {
    petStateActions.setLoading(true)
    try {
      const response = await petService.list(params)
      petStateActions.setPets(response)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao carregar pets'
      petStateActions.setError(message)
      throw error
    }
  }

  /**
   * Get pet by ID
   */
  async getPetById(id: number): Promise<PetDetail> {
    try {
      const pet = await petService.getById(id)
      petStateActions.setSelectedPet(pet)
      return pet
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao carregar pet'
      petStateActions.setError(message)
      throw error
    }
  }

  /**
   * Create a new pet
   */
  async createPet(data: PetCreateRequest): Promise<Pet> {
    petStateActions.setLoading(true)
    try {
      const newPet = await petService.create(data)
      petStateActions.addPet(newPet)
      petStateActions.setLoading(false)
      return newPet
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar pet'
      petStateActions.setError(message)
      throw error
    }
  }

  /**
   * Update an existing pet
   */
  async updatePet(id: number, data: PetUpdateRequest): Promise<Pet> {
    petStateActions.setLoading(true)
    try {
      const updatedPet = await petService.update(id, data)
      petStateActions.updatePet(id, updatedPet)
      petStateActions.setLoading(false)
      return updatedPet
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao atualizar pet'
      petStateActions.setError(message)
      throw error
    }
  }

  /**
   * Delete a pet
   */
  async deletePet(id: number): Promise<void> {
    petStateActions.setLoading(true)
    try {
      await petService.delete(id)
      petStateActions.removePet(id)
      petStateActions.setLoading(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao excluir pet'
      petStateActions.setError(message)
      throw error
    }
  }

  /**
   * Upload pet photo
   */
  async uploadPhoto(id: number, photo: PetPhotoUpload): Promise<Pet> {
    try {
      const updatedPet = await petService.uploadPhoto(id, photo)
      petStateActions.updatePet(id, updatedPet)
      return updatedPet
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao enviar foto'
      petStateActions.setError(message)
      throw error
    }
  }

  /**
   * Select a pet for viewing/editing
   */
  selectPet(pet: Pet | null): void {
    petStateActions.setSelectedPet(pet)
  }

  /**
   * Clear any errors
   */
  clearError(): void {
    petStateActions.setError(null)
  }

  /**
   * Reset state to initial values
   */
  reset(): void {
    petStateActions.reset()
  }
}

export const petFacade = new PetFacade()
