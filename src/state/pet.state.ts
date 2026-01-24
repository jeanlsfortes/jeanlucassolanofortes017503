import { BehaviorSubject } from 'rxjs'
import type { Pet, PetListResponse } from '@/api/types/pet.types'

export interface PetState {
  pets: Pet[]
  total: number
  page: number
  size: number
  pageCount: number
  loading: boolean
  error: string | null
  selectedPet: Pet | null
}

const initialState: PetState = {
  pets: [],
  total: 0,
  page: 1,
  size: 10,
  pageCount: 0,
  loading: false,
  error: null,
  selectedPet: null,
}

export const petState$ = new BehaviorSubject<PetState>(initialState)

export const petStateActions = {
  setLoading: (loading: boolean) => {
    petState$.next({ ...petState$.getValue(), loading, error: null })
  },

  setPets: (data: PetListResponse) => {
    petState$.next({
      ...petState$.getValue(),
      pets: data.content,
      total: data.total,
      page: data.page,
      size: data.size,
      pageCount: data.pageCount,
      loading: false,
      error: null,
    })
  },

  addPet: (pet: Pet) => {
    const current = petState$.getValue()
    petState$.next({
      ...current,
      pets: [pet, ...current.pets],
      total: current.total + 1,
    })
  },

  updatePet: (id: number, updatedPet: Partial<Pet>) => {
    const current = petState$.getValue()
    petState$.next({
      ...current,
      pets: current.pets.map((pet) =>
        pet.id === id ? { ...pet, ...updatedPet } : pet
      ),
    })
  },

  removePet: (id: number) => {
    const current = petState$.getValue()
    petState$.next({
      ...current,
      pets: current.pets.filter((pet) => pet.id !== id),
      total: Math.max(0, current.total - 1),
    })
  },

  setSelectedPet: (pet: Pet | null) => {
    petState$.next({ ...petState$.getValue(), selectedPet: pet })
  },

  setError: (error: string | null) => {
    petState$.next({ ...petState$.getValue(), error, loading: false })
  },

  reset: () => {
    petState$.next(initialState)
  },
}

export type { Pet }
