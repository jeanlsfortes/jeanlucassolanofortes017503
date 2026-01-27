import { useState, useEffect, useCallback } from 'react'
import { tutorFacade } from '@/facades/tutor.facade'
import type { TutorState } from '@/state/tutor.state'
import type {
  TutorCreateRequest,
  TutorUpdateRequest,
  TutorPhotoUpload,
  TutorListParams,
} from '@/api/types/tutor.types'

/**
 * Hook to access reactive tutor state and actions
 * Integrates RxJS BehaviorSubject with React
 */
export function useTutorState() {
  const [state, setState] = useState<TutorState>(tutorFacade.currentState)

  useEffect(() => {
    const subscription = tutorFacade.state$.subscribe(setState)
    return () => subscription.unsubscribe()
  }, [])

  const loadTutors = useCallback(async (params?: TutorListParams) => {
    return tutorFacade.loadTutors(params)
  }, [])

  const getTutorById = useCallback(async (id: number) => {
    return tutorFacade.getTutorById(id)
  }, [])

  const createTutor = useCallback(async (data: TutorCreateRequest) => {
    return tutorFacade.createTutor(data)
  }, [])

  const updateTutor = useCallback(async (id: number, data: TutorUpdateRequest) => {
    return tutorFacade.updateTutor(id, data)
  }, [])

  const deleteTutor = useCallback(async (id: number) => {
    return tutorFacade.deleteTutor(id)
  }, [])

  const uploadPhoto = useCallback(async (id: number, photo: TutorPhotoUpload) => {
    return tutorFacade.uploadPhoto(id, photo)
  }, [])

  const linkPet = useCallback(async (tutorId: number, petId: number) => {
    return tutorFacade.linkPet(tutorId, petId)
  }, [])

  const unlinkPet = useCallback(async (tutorId: number, petId: number) => {
    return tutorFacade.unlinkPet(tutorId, petId)
  }, [])

  const getTutorPets = useCallback(async (tutorId: number) => {
    return tutorFacade.getTutorPets(tutorId)
  }, [])

  const selectTutor = useCallback((tutor: TutorState['selectedTutor']) => {
    tutorFacade.selectTutor(tutor)
  }, [])

  const clearError = useCallback(() => {
    tutorFacade.clearError()
  }, [])

  const reset = useCallback(() => {
    tutorFacade.reset()
  }, [])

  return {
    // State
    tutors: state.tutors,
    total: state.total,
    page: state.page,
    size: state.size,
    pageCount: state.pageCount,
    loading: state.loading,
    error: state.error,
    selectedTutor: state.selectedTutor,

    // Actions
    loadTutors,
    getTutorById,
    createTutor,
    updateTutor,
    deleteTutor,
    uploadPhoto,
    linkPet,
    unlinkPet,
    getTutorPets,
    selectTutor,
    clearError,
    reset,
  }
}
