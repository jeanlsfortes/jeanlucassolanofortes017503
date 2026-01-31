import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

import { tutorService } from '@/api/services/tutor.service'
import { petService } from '@/api/services/pet.service'
import { ROUTES } from '@/@core/configs/routes.config'
import LinkedPetsSelector from '@/components/shared/LinkedPetsSelector/LinkedPetsSelector'
import type { Tutor } from '@/api/types/tutor.types'
import type { Pet } from '@/api/types/pet.types'

interface LinkPetModalProps {
  tutor: Tutor
  isOpen: boolean
  onClose: () => void
}

const LinkPetModal = ({ tutor, isOpen, onClose }: LinkPetModalProps) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [petSearchTerm, setPetSearchTerm] = useState('')
  const [linkError, setLinkError] = useState<string | null>(null)

  const handleClose = useCallback(() => {
    setPetSearchTerm('')
    setLinkError(null)
    queryClient.invalidateQueries({ queryKey: ['tutor', tutor.id] })
    queryClient.invalidateQueries({ queryKey: ['tutor', String(tutor.id)] })
    queryClient.invalidateQueries({ queryKey: ['tutors'] })
    onClose()
  }, [onClose, queryClient, tutor.id])

  const { data: fullTutor } = useQuery({
    queryKey: ['tutor', tutor.id],
    queryFn: () => tutorService.getById(tutor.id),
    enabled: isOpen,
  })

  const tutorWithPets = fullTutor ?? tutor

  const {
    data: availablePets,
    isLoading: isLoadingPets,
    isError: isPetsError,
    error: petsError,
    refetch: refetchPets,
  } = useQuery({
    queryKey: ['pets', 'forLinking', tutor.id, petSearchTerm],
    queryFn: async () => {
      const result = await petService.list({
        page: 1,
        size: 100,
        nome: petSearchTerm.trim() || undefined,
      })
      if (result.content.length === 0 && result.total > 0 && !petSearchTerm.trim()) {
        const fallback = await petService.list({
          page: 0,
          size: 100,
          nome: undefined,
        })
        return fallback
      }
      return result
    },
    enabled: isOpen,
    refetchOnMount: 'always',
    staleTime: 0,
  })

  const linkPetMutation = useMutation({
    mutationFn: ({ tutorId, petId }: { tutorId: number; petId: number }) =>
      tutorService.linkPet(tutorId, petId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] })
      queryClient.invalidateQueries({ queryKey: ['tutor', variables.tutorId] })
      setLinkError(null)
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setLinkError(error.response?.data?.message || t('tutors.linkError'))
    },
  })

  const unlinkPetMutation = useMutation({
    mutationFn: ({ tutorId, petId }: { tutorId: number; petId: number }) =>
      tutorService.unlinkPet(tutorId, petId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] })
      queryClient.invalidateQueries({ queryKey: ['tutor', variables.tutorId] })
      setLinkError(null)
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setLinkError(error.response?.data?.message || t('tutors.unlinkError'))
    },
  })

  const handleLinkPet = useCallback(
    (pet: Pet) => {
      linkPetMutation.mutate({ tutorId: tutor.id, petId: pet.id })
    },
    [tutor.id, linkPetMutation]
  )

  const handleUnlinkPet = useCallback(
    (petId: number) => {
      if (window.confirm(t('tutors.removeLinkConfirm'))) {
        unlinkPetMutation.mutate({ tutorId: tutor.id, petId })
      }
    },
    [tutor.id, unlinkPetMutation, t]
  )

  const linkedPetIds = tutorWithPets?.pets?.map((p) => p.id) || []
  const allPets = availablePets?.content ?? []
  const filteredAvailablePets = allPets.filter((p) => !linkedPetIds.includes(p.id))

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('tutors.linkPetTitle')}
            </h2>
            <p className="text-sm text-gray-500">
              {t('tutors.selectPetToLink', { name: tutor.nome })}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto flex-1 min-h-0">
          {linkError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {linkError}
            </div>
          )}

          {(availablePets?.total ?? 0) === 0 && !isLoadingPets && !isPetsError ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">{t('pets.noPetsRegistered')}</p>
              <Link
                to={ROUTES.PETS.NEW}
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                {t('pets.registerPet')}
              </Link>
            </div>
          ) : (
            <LinkedPetsSelector
              linkedPets={tutorWithPets?.pets ?? []}
              availablePets={filteredAvailablePets}
              searchValue={petSearchTerm}
              onSearchChange={setPetSearchTerm}
              onLinkPet={handleLinkPet}
              onUnlinkPet={handleUnlinkPet}
              isLoading={isLoadingPets}
              isError={isPetsError}
              error={petsError}
              onRetry={refetchPets}
              isLinking={linkPetMutation.isPending}
              isUnlinking={unlinkPetMutation.isPending}
              variant="modal"
              expanded
              allPetsCount={availablePets?.total ?? 0}
              showLinkButton={false}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleClose}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LinkPetModal
