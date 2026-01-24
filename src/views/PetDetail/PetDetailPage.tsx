import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { petService } from '@/api/services/pet.service'
import { ROUTES } from '@/@core/configs/routes.config'
import TutorCard from '@/components/shared/TutorCard/TutorCard'
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal'

const PetDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const {
    data: pet,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['pet', id],
    queryFn: () => petService.getById(Number(id)),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => petService.delete(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      navigate(ROUTES.PETS.LIST)
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  const placeholderImage =
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80'

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">
            Erro ao carregar pet:{' '}
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <button
            onClick={() => navigate(ROUTES.PETS.LIST)}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Voltar para lista
          </button>
        </div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="px-4 py-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-700">Pet nao encontrado</p>
          <button
            onClick={() => navigate(ROUTES.PETS.LIST)}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Voltar para lista
          </button>
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
        <span>Voltar</span>
      </button>

      {/* Pet Info Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Pet Image */}
          <div className="md:w-1/3">
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="w-full h-64 md:h-full relative group cursor-pointer"
            >
              <img
                src={pet.foto?.url || placeholderImage}
                alt={pet.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = placeholderImage
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </button>
          </div>

          {/* Pet Details */}
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {pet.nome}
            </h1>

            <div className="space-y-3">
              {pet.raca && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-medium w-20">Raca:</span>
                  <span className="text-gray-900">{pet.raca}</span>
                </div>
              )}

              {pet.idade !== undefined && pet.idade !== null && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-medium w-20">Idade:</span>
                  <span className="text-gray-900">
                    {pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <Link
                to={ROUTES.PETS.EDIT(String(pet.id))}
                className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tutors Section */}
      {pet.tutores && pet.tutores.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Tutores ({pet.tutores.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pet.tutores.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      )}

      {/* No Tutors Message */}
      {(!pet.tutores || pet.tutores.length === 0) && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tutores</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-500">Este pet nao possui tutores vinculados.</p>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <svg
                className="w-8 h-8"
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
            <img
              src={pet.foto?.url || placeholderImage}
              alt={pet.nome}
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Excluir Pet"
        message={`Tem certeza que deseja excluir ${pet.nome}? Esta acao nao pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}

export default PetDetailPage

