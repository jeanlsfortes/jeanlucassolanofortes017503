import { Observable } from 'rxjs'
import { tutorService } from '@/api/services/tutor.service'
import { tutorState$, tutorStateActions, type TutorState } from '@/state/tutor.state'
import type {
  Tutor,
  TutorCreateRequest,
  TutorUpdateRequest,
  TutorPhotoUpload,
  TutorListParams,
} from '@/api/types/tutor.types'
import type { Pet } from '@/api/types/pet.types'
import { extractErrorMessage } from '@/utils/error.utils'

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
      const message = extractErrorMessage(error, 'tutors.loadError')
      tutorStateActions.setError(message)
      throw error
    } finally {
      tutorStateActions.setLoading(false)
    }
  }

  /**
   * Get tutor by ID
   */
  async getTutorById(id: number): Promise<Tutor> {
    tutorStateActions.setLoading(true)
    try {
      const tutor = await tutorService.getById(id)
      tutorStateActions.setSelectedTutor(tutor)
      return tutor
    } catch (error) {
      const message = extractErrorMessage(error, 'tutors.loadError')
      tutorStateActions.setError(message)
      throw error
    } finally {
      tutorStateActions.setLoading(false)
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
      return newTutor
    } catch (error) {
      const message = extractErrorMessage(error, 'tutors.createError')
      tutorStateActions.setError(message)
      throw error
    } finally {
      tutorStateActions.setLoading(false)
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
      return updatedTutor
    } catch (error) {
      const message = extractErrorMessage(error, 'tutors.updateError')
      tutorStateActions.setError(message)
      throw error
    } finally {
      tutorStateActions.setLoading(false)
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
    } catch (error) {
      const message = extractErrorMessage(error, 'tutors.deleteError')
      tutorStateActions.setError(message)
      throw error
    } finally {
      tutorStateActions.setLoading(false)
    }
  }

  /**
   * Upload tutor photo
   */
  async uploadPhoto(id: number, photo: TutorPhotoUpload): Promise<Tutor> {
    tutorStateActions.setLoading(true)
    try {
      const updatedTutor = await tutorService.uploadPhoto(id, photo)
      tutorStateActions.updateTutor(id, updatedTutor)
      return updatedTutor
    } catch (error) {
      const message = extractErrorMessage(error, 'common.error')
      tutorStateActions.setError(message)
      throw error
    } finally {
      tutorStateActions.setLoading(false)
    }
  }

  /**
   * Link a pet to a tutor
   */
  async linkPet(tutorId: number, petId: number): Promise<void> {
    tutorStateActions.setLoading(true)
    try {
      await tutorService.linkPet(tutorId, petId)
      // Reload tutor to get updated pet list
      await this.getTutorById(tutorId)
    } catch (error) {
      const message = extractErrorMessage(error, 'tutors.linkError')
      tutorStateActions.setError(message)
      throw error
    } finally {
      tutorStateActions.setLoading(false)
    }
  }

  /**
   * Unlink a pet from a tutor
   */
  async unlinkPet(tutorId: number, petId: number): Promise<void> {
    tutorStateActions.setLoading(true)
    try {
      await tutorService.unlinkPet(tutorId, petId)
      // Update local state - updateTutor will also update selectedTutor if it matches
      const currentState = this.currentState
      const tutor = currentState.tutors.find((t) => t.id === tutorId) || currentState.selectedTutor
      if (tutor && tutor.id === tutorId) {
        tutorStateActions.updateTutor(tutorId, {
          pets: tutor.pets?.filter((p) => p.id !== petId),
        })
      }
    } catch (error) {
      const message = extractErrorMessage(error, 'tutors.unlinkError')
      tutorStateActions.setError(message)
      throw error
    } finally {
      tutorStateActions.setLoading(false)
    }
  }

  /**
   * Get pets for a tutor
   */
  async getTutorPets(tutorId: number): Promise<Pet[]> {
    tutorStateActions.setLoading(true)
    try {
      return await tutorService.getPets(tutorId)
    } catch (error) {
      const message = extractErrorMessage(error, 'pets.loadError')
      tutorStateActions.setError(message)
      throw error
    } finally {
      tutorStateActions.setLoading(false)
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
