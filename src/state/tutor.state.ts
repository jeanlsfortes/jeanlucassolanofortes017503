import { BehaviorSubject } from 'rxjs'
import type { Tutor, TutorListResponse } from '@/api/types/tutor.types'

export interface TutorState {
  tutors: Tutor[]
  total: number
  page: number
  size: number
  pageCount: number
  loading: boolean
  error: string | null
  selectedTutor: Tutor | null
}

const initialState: TutorState = {
  tutors: [],
  total: 0,
  page: 1,
  size: 10,
  pageCount: 0,
  loading: false,
  error: null,
  selectedTutor: null,
}

export const tutorState$ = new BehaviorSubject<TutorState>(initialState)

export const tutorStateActions = {
  setLoading: (loading: boolean) => {
    const current = tutorState$.getValue()
    tutorState$.next({
      ...current,
      loading,
      ...(loading ? { error: null } : {}), // Only clear error when starting new operation
    })
  },

  setTutors: (data: TutorListResponse) => {
    tutorState$.next({
      ...tutorState$.getValue(),
      tutors: data.content,
      total: data.total,
      page: data.page,
      size: data.size,
      pageCount: data.pageCount,
      loading: false,
      error: null,
    })
  },

  addTutor: (tutor: Tutor) => {
    const current = tutorState$.getValue()
    tutorState$.next({
      ...current,
      tutors: [tutor, ...current.tutors],
      total: current.total + 1,
    })
  },

  updateTutor: (id: number, updatedTutor: Partial<Tutor>) => {
    const current = tutorState$.getValue()
    const updatedTutors = current.tutors.map((tutor) =>
      tutor.id === id ? { ...tutor, ...updatedTutor } : tutor
    )
    const updatedSelectedTutor =
      current.selectedTutor?.id === id
        ? { ...current.selectedTutor, ...updatedTutor }
        : current.selectedTutor

    tutorState$.next({
      ...current,
      tutors: updatedTutors,
      selectedTutor: updatedSelectedTutor,
    })
  },

  removeTutor: (id: number) => {
    const current = tutorState$.getValue()
    tutorState$.next({
      ...current,
      tutors: current.tutors.filter((tutor) => tutor.id !== id),
      total: Math.max(0, current.total - 1),
    })
  },

  setSelectedTutor: (tutor: Tutor | null) => {
    tutorState$.next({ ...tutorState$.getValue(), selectedTutor: tutor })
  },

  setError: (error: string | null) => {
    tutorState$.next({ ...tutorState$.getValue(), error, loading: false })
  },

  reset: () => {
    tutorState$.next(initialState)
  },
}

export type { Tutor }
