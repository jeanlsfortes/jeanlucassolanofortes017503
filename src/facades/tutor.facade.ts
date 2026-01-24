import { Observable } from 'rxjs'
import { tutorService, type TutorListParams } from '@/api/services/tutor.service'
import { tutorState$, tutorStateActions, type TutorState } from '@/state/tutor.state'
import type {
  Tutor,
  TutorCreateRequest,
  TutorUpdateRequest,
  TutorPhotoUpload,
} from '@/api/types/tutor.types'
import type { Pet } from '@/api/types/pet.types'

/**
 * TutorFacade - Provides a unified interface for tutor operations
 * Combines service calls with reactive state management
 */
class TutorFacade {
  /**
   * Get tutor state as Observable (reactive)
   */
  get state$(): Observable<TutorState> {
    return tutorState$.asObservable()
  }

  /**
   * Get current tutor state (snapshot)
   */
  get currentState(): TutorState {
    return tutorState$.getValue()
  }

  /**
   * Load tutors with optional filters
   */
  async loadTutors(params?: TutorListParams): Promise<void> {
    tutorStateActions.setLoading(true)
    try {
      const response = await tutorService.list(params)
      tutorStateActions.setTutors(response)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao carregar tutores'
      tutorStateActions.setError(message)
      throw error
    }
  }

  /**
   * Get tutor by ID
   */
  async getTutorById(id: number): Promise<Tutor> {
    try {
      const tutor = await tutorService.getById(id)
      tutorStateActions.setSelectedTutor(tutor)
      return tutor
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao carregar tutor'
      tutorStateActions.setError(message)
      throw error
    }
  }

  /**
   * Create a new tutor
   */
  async createTutor(data: TutorCreateRequest): Promise<Tutor> {
    tutorStateActions.setLoading(true)
    try {
      const newTutor = await tutorService.create(data)
      tutorStateActions.addTutor(newTutor)
      tutorStateActions.setLoading(false)
      return newTutor
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar tutor'
      tutorStateActions.setError(message)
      throw error
    }
  }

  /**
   * Update an existing tutor
   */
  async updateTutor(id: number, data: TutorUpdateRequest): Promise<Tutor> {
    tutorStateActions.setLoading(true)
    try {
      const updatedTutor = await tutorService.update(id, data)
      tutorStateActions.updateTutor(id, updatedTutor)
      tutorStateActions.setLoading(false)
      return updatedTutor
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao atualizar tutor'
      tutorStateActions.setError(message)
      throw error
    }
  }

  /**
   * Delete a tutor
   */
  async deleteTutor(id: number): Promise<void> {
    tutorStateActions.setLoading(true)
    try {
      await tutorService.delete(id)
      tutorStateActions.removeTutor(id)
      tutorStateActions.setLoading(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao excluir tutor'
      tutorStateActions.setError(message)
      throw error
    }
  }

  /**
   * Upload tutor photo
   */
  async uploadPhoto(id: number, photo: TutorPhotoUpload): Promise<Tutor> {
    try {
      const updatedTutor = await tutorService.uploadPhoto(id, photo)
      tutorStateActions.updateTutor(id, updatedTutor)
      return updatedTutor
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao enviar foto'
      tutorStateActions.setError(message)
      throw error
    }
  }

  /**
   * Link a pet to a tutor
   */
  async linkPet(tutorId: number, petId: number): Promise<void> {
    try {
      await tutorService.linkPet(tutorId, petId)
      // Reload tutor to get updated pet list
      await this.getTutorById(tutorId)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao vincular pet'
      tutorStateActions.setError(message)
      throw error
    }
  }

  /**
   * Unlink a pet from a tutor
   */
  async unlinkPet(tutorId: number, petId: number): Promise<void> {
    try {
      await tutorService.unlinkPet(tutorId, petId)
      // Update local state
      const tutor = this.currentState.selectedTutor
      if (tutor && tutor.id === tutorId) {
        tutorStateActions.updateTutor(tutorId, {
          ...tutor,
          pets: tutor.pets?.filter((p) => p.id !== petId),
        })
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao desvincular pet'
      tutorStateActions.setError(message)
      throw error
    }
  }

  /**
   * Get pets for a tutor
   */
  async getTutorPets(tutorId: number): Promise<Pet[]> {
    try {
      return await tutorService.getPets(tutorId)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao carregar pets do tutor'
      tutorStateActions.setError(message)
      throw error
    }
  }

  /**
   * Select a tutor for viewing/editing
   */
  selectTutor(tutor: Tutor | null): void {
    tutorStateActions.setSelectedTutor(tutor)
  }

  /**
   * Clear any errors
   */
  clearError(): void {
    tutorStateActions.setError(null)
  }

  /**
   * Reset state to initial values
   */
  reset(): void {
    tutorStateActions.reset()
  }
}

export const tutorFacade = new TutorFacade()
