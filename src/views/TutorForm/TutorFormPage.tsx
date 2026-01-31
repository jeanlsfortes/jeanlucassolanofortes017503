import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

import { tutorSchema, type TutorFormData } from '@/utils/validators'
import { tutorService } from '@/api/services/tutor.service'
import { ROUTES } from '@/@core/configs/routes.config'
import { applyPhoneMask } from '@/utils/masks'
import Input from '@/components/ui/Input/Input'
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal'
import LinkedPetsSelector from '@/components/shared/LinkedPetsSelector/LinkedPetsSelector'
import LinkPetModal from '@/components/shared/LinkPetModal/LinkPetModal'

const TutorFormPage = () => {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditMode = !!id
  const [apiError, setApiError] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [phoneDisplay, setPhoneDisplay] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [showLinkPetModal, setShowLinkPetModal] = useState(false)

  // Fetch tutor data for edit mode
  const { data: tutorData, isLoading: isLoadingTutor } = useQuery({
    queryKey: ['tutor', id],
    queryFn: () => tutorService.getById(Number(id)),
    enabled: isEditMode,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TutorFormData>({
    resolver: zodResolver(tutorSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
    },
  })

  // Populate form when tutor data is loaded
  useEffect(() => {
    if (tutorData) {
      reset({
        nome: tutorData.nome,
        email: tutorData.email || '',
        telefone: tutorData.telefone || '',
        endereco: tutorData.endereco || '',
      })
      if (tutorData.telefone) {
        setPhoneDisplay(applyPhoneMask(tutorData.telefone))
      }
      if (tutorData.foto?.url) {
        setPhotoPreview(tutorData.foto.url)
      }
    }
  }, [tutorData, reset])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: tutorService.create,
    onSuccess: async (newTutor) => {
      if (photoFile) {
        await uploadPhoto(newTutor.id)
      }
      queryClient.invalidateQueries({ queryKey: ['tutors'] })
      navigate(-1)
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setApiError(error.response?.data?.message || t('tutors.createError'))
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TutorFormData }) =>
      tutorService.update(id, data),
    onSuccess: async (updatedTutor) => {
      if (photoFile) {
        await uploadPhoto(updatedTutor.id)
      }
      queryClient.invalidateQueries({ queryKey: ['tutors'] })
      queryClient.invalidateQueries({ queryKey: ['tutor', id] })
      navigate(-1)
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setApiError(error.response?.data?.message || t('tutors.updateError'))
    },
  })

  // Unlink pet mutation
  const unlinkPetMutation = useMutation({
    mutationFn: ({ tutorId, petId }: { tutorId: number; petId: number }) =>
      tutorService.unlinkPet(tutorId, petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor', id] })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setApiError(error.response?.data?.message || t('tutors.unlinkError'))
    },
  })

  // Delete tutor mutation
  const deleteMutation = useMutation({
    mutationFn: () => tutorService.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] })
      navigate(ROUTES.TUTORES.LIST)
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setApiError(error.response?.data?.message || t('tutors.deleteError'))
      setIsDeleteModalOpen(false)
    },
  })

  const handleDeleteTutor = () => {
    deleteMutation.mutate()
  }

  const uploadPhoto = async (tutorId: number) => {
    if (!photoFile) return

    setIsUploadingPhoto(true)
    try {
      await tutorService.uploadPhoto(tutorId, { file: photoFile })
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error)
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const onSubmit = (data: TutorFormData) => {
    setApiError(null)

    const cleanData = {
      nome: data.nome,
      email: data.email || undefined,
      telefone: data.telefone || undefined,
      endereco: data.endereco || undefined,
    }

    if (isEditMode) {
      updateMutation.mutate({ id: Number(id), data: cleanData })
    } else {
      createMutation.mutate(cleanData)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const masked = applyPhoneMask(value)
    setPhoneDisplay(masked)
    setValue('telefone', value.replace(/\D/g, ''))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setApiError(t('pets.invalidImage'))
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setApiError(t('pets.imageTooLarge'))
        return
      }
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
      setApiError(null)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUnlinkPet = (petId: number) => {
    if (id && confirm(t('tutors.removeLinkConfirm'))) {
      unlinkPetMutation.mutate({ tutorId: Number(id), petId })
    }
  }

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || isUploadingPhoto

  if (isEditMode && isLoadingTutor) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>{t('common.back')}</span>
      </button>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        {isEditMode ? t('tutors.editTutor') : t('tutors.newTutor')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('tutors.tutorPhoto')}
              </label>
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="tutor-photo-upload"
                  />
                  <label
                    htmlFor="tutor-photo-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {t('pets.selectPhoto')}
                  </label>
                  <p className="mt-2 text-xs text-gray-500">{t('pets.photoRequirements')}</p>
                </div>
              </div>
            </div>

            {/* Nome */}
            <Input
              label={t('tutors.fullName')}
              type="text"
              placeholder={t('tutors.namePlaceholder')}
              error={errors.nome?.message}
              {...register('nome')}
            />

            {/* Email */}
            <Input
              label={t('tutors.email')}
              type="email"
              placeholder={t('tutors.emailPlaceholder')}
              error={errors.email?.message}
              {...register('email')}
            />

            {/* Telefone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tutors.phone')}
              </label>
              <input
                type="tel"
                value={phoneDisplay}
                onChange={handlePhoneChange}
                placeholder={t('tutors.phonePlaceholder')}
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.telefone?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>
              )}
            </div>

            {/* Endereco */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('tutors.address')}
              </label>
              <textarea
                placeholder={t('tutors.addressPlaceholder')}
                rows={3}
                className="w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                {...register('endereco')}
              />
              {errors.endereco?.message && (
                <p className="mt-1 text-sm text-red-600">{errors.endereco.message}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('common.saving') : isEditMode ? t('tutors.saveChanges') : t('tutors.registerTutor')}
              </button>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t('tutors.deleteTutor')}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Linked Pets Section (Edit Mode Only) */}
        {isEditMode && tutorData && (
          <div className="lg:col-span-1">
            <LinkedPetsSelector
              linkedPets={tutorData.pets ?? []}
              availablePets={[]}
              searchValue=""
              onSearchChange={() => {}}
              onLinkPet={() => {}}
              onUnlinkPet={handleUnlinkPet}
              isUnlinking={unlinkPetMutation.isPending}
              variant="inline"
              onLinkClick={() => setShowLinkPetModal(true)}
              showLinkButton
            />
            <LinkPetModal
              tutor={tutorData}
              isOpen={showLinkPetModal}
              onClose={() => {
                queryClient.invalidateQueries({ queryKey: ['tutor', id] })
                setShowLinkPetModal(false)
              }}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={t('tutors.deleteConfirmTitle')}
        message={t('tutors.deleteConfirmMessage', { name: tutorData?.nome || 'este tutor' })}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteTutor}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}

export default TutorFormPage
