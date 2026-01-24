import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

import { petSchema, type PetFormData } from '@/utils/validators'
import { petService } from '@/api/services/pet.service'
import { ROUTES } from '@/@core/configs/routes.config'
import Input from '@/components/ui/Input/Input'

const PetFormPage = () => {
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

  // Fetch pet data for edit mode
  const { data: petData, isLoading: isLoadingPet } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => petService.getById(Number(id)),
    enabled: isEditMode,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      nome: '',
      raca: '',
      idade: undefined,
    },
  })

  // Populate form when pet data is loaded
  useEffect(() => {
    if (petData) {
      reset({
        nome: petData.nome,
        raca: petData.raca || '',
        idade: petData.idade,
      })
      if (petData.foto?.url) {
        setPhotoPreview(petData.foto.url)
      }
    }
  }, [petData, reset])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: petService.create,
    onSuccess: async (newPet) => {
      // Upload photo if selected
      if (photoFile) {
        await uploadPhoto(newPet.id)
      }
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      navigate(ROUTES.PETS.DETAIL(String(newPet.id)), { replace: true })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setApiError(error.response?.data?.message || t('pets.createError'))
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PetFormData }) =>
      petService.update(id, data),
    onSuccess: async (updatedPet) => {
      // Upload photo if new one selected
      if (photoFile) {
        await uploadPhoto(updatedPet.id)
      }
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      queryClient.invalidateQueries({ queryKey: ['pet', id] })
      navigate(ROUTES.PETS.DETAIL(String(updatedPet.id)), { replace: true })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setApiError(error.response?.data?.message || t('pets.updateError'))
    },
  })

  const uploadPhoto = async (petId: number) => {
    if (!photoFile) return

    setIsUploadingPhoto(true)
    try {
      await petService.uploadPhoto(petId, { file: photoFile })
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error)
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  const onSubmit = (data: PetFormData) => {
    setApiError(null)

    // Clean up empty strings
    const cleanData = {
      nome: data.nome,
      raca: data.raca || undefined,
      idade: data.idade,
    }

    if (isEditMode) {
      updateMutation.mutate({ id: Number(id), data: cleanData })
    } else {
      createMutation.mutate(cleanData)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setApiError(t('pets.invalidImage'))
        return
      }

      // Validate file size (max 5MB)
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

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || isUploadingPhoto

  if (isEditMode && isLoadingPet) {
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>{t('common.back')}</span>
      </button>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        {isEditMode ? t('pets.editPet') : t('pets.newPet')}
      </h1>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Alert */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('pets.petPhoto')}
            </label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {photoPreview ? (
                  <>
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <svg
                        className="w-4 h-4"
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
                  </>
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  {t('pets.selectPhoto')}
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  {t('pets.photoRequirements')}
                </p>
              </div>
            </div>
          </div>

          {/* Nome */}
          <Input
            label={t('pets.nameRequired')}
            type="text"
            placeholder={t('pets.namePlaceholder')}
            error={errors.nome?.message}
            {...register('nome')}
          />

          {/* Raca */}
          <Input
            label={t('pets.breed')}
            type="text"
            placeholder={t('pets.breedPlaceholder')}
            error={errors.raca?.message}
            {...register('raca')}
          />

          {/* Idade */}
          <Input
            label={t('pets.ageYears')}
            type="number"
            placeholder={t('pets.agePlaceholder')}
            min={0}
            max={50}
            error={errors.idade?.message}
            {...register('idade')}
          />

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
              {isSubmitting
                ? t('common.saving')
                : isEditMode
                  ? t('pets.saveChanges')
                  : t('pets.registerPet')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PetFormPage
