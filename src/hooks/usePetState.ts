import { useState, useEffect, useCallback } from 'react'
import { petFacade } from '@/facades/pet.facade'
import type { PetState } from '@/state/pet.state'
import type { PetListParams, PetCreateRequest, PetUpdateRequest, PetPhotoUpload } from '@/api/types/pet.types'

/**
 * Hook to access reactive pet state and actions
 * Integrates RxJS BehaviorSubject with React
 */
export function usePetState() {
  const [state, setState] = useState<PetState>(petFacade.currentState)

  useEffect(() => {
    const subscription = petFacade.state$.subscribe(setState)
    return () => subscription.unsubscribe()
  }, [])

  const loadPets = useCallback(async (params?: PetListParams) => {
    return petFacade.loadPets(params)
  }, [])

  const getPetById = useCallback(async (id: number) => {
    return petFacade.getPetById(id)
  }, [])

  const createPet = useCallback(async (data: PetCreateRequest) => {
    return petFacade.createPet(data)
  }, [])

  const updatePet = useCallback(async (id: number, data: PetUpdateRequest) => {
    return petFacade.updatePet(id, data)
  }, [])

  const deletePet = useCallback(async (id: number) => {
    return petFacade.deletePet(id)
  }, [])

  const uploadPhoto = useCallback(async (id: number, photo: PetPhotoUpload) => {
    return petFacade.uploadPhoto(id, photo)
  }, [])

  const selectPet = useCallback((pet: PetState['selectedPet']) => {
    petFacade.selectPet(pet)
  }, [])

  const clearError = useCallback(() => {
    petFacade.clearError()
  }, [])

  const reset = useCallback(() => {
    petFacade.reset()
  }, [])

  return {
    // State
    pets: state.pets,
    total: state.total,
    page: state.page,
    size: state.size,
    pageCount: state.pageCount,
    loading: state.loading,
    error: state.error,
    selectedPet: state.selectedPet,

    // Actions
    loadPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
    uploadPhoto,
    selectPet,
    clearError,
    reset,
  }
}
