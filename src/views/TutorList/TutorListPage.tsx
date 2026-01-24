import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AxiosError } from 'axios'

import { tutorService } from '@/api/services/tutor.service'
import { petService } from '@/api/services/pet.service'
import { ROUTES } from '@/@core/configs/routes.config'
import TutorListCard from '@/components/shared/TutorListCard/TutorListCard'
import SearchInput from '@/components/ui/SearchInput/SearchInput'
import Pagination from '@/components/ui/Pagination/Pagination'
import type { Tutor } from '@/api/types/tutor.types'
import type { Pet } from '@/api/types/pet.types'

const PAGE_SIZE = 10

const TutorListPage = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  // Modal states
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null)
  const [petSearchTerm, setPetSearchTerm] = useState('')
  const [linkError, setLinkError] = useState<string | null>(null)

  // Fetch tutors
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tutors', page, searchTerm],
    queryFn: () =>
      tutorService.list({
        page,
        size: PAGE_SIZE,
        nome: searchTerm || undefined,
      }),
    staleTime: 1000 * 60,
  })

  // Fetch available pets for linking
  const { data: availablePets, isLoading: isLoadingPets } = useQuery({
    queryKey: ['pets', 'forLinking', petSearchTerm],
    queryFn: () => petService.list({ page: 0, size: 50, nome: petSearchTerm || undefined }),
    enabled: !!selectedTutor,
  })

  // Link pet mutation
  const linkPetMutation = useMutation({
    mutationFn: ({ tutorId, petId }: { tutorId: number; petId: number }) =>
      tutorService.linkPet(tutorId, petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] })
      setSelectedTutor(null)
      setPetSearchTerm('')
      setLinkError(null)
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      setLinkError(error.response?.data?.message || 'Erro ao vincular pet')
    },
  })

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setPage(0)
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleOpenLinkModal = useCallback((tutor: Tutor) => {
    setSelectedTutor(tutor)
    setPetSearchTerm('')
    setLinkError(null)
  }, [])

  const handleCloseLinkModal = useCallback(() => {
    setSelectedTutor(null)
    setPetSearchTerm('')
    setLinkError(null)
  }, [])

  const handleLinkPet = useCallback(
    (pet: Pet) => {
      if (selectedTutor) {
        linkPetMutation.mutate({ tutorId: selectedTutor.id, petId: pet.id })
      }
    },
    [selectedTutor, linkPetMutation]
  )

  // Filter pets that are not already linked to the selected tutor
  const linkedPetIds = selectedTutor?.pets?.map((p) => p.id) || []
  const filteredAvailablePets =
    availablePets?.content.filter((p) => !linkedPetIds.includes(p.id)) || []

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lista de Tutores</h1>

        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por nome..."
            className="w-full sm:w-64"
          />

          <Link
            to={ROUTES.TUTORES.NEW}
            className="flex-shrink-0 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span className="hidden sm:inline">Novo Tutor</span>
            <span className="sm:hidden">+</span>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">
            Erro ao carregar tutores:{' '}
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data?.content.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum tutor encontrado' : 'Nenhum tutor cadastrado'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? `Nao encontramos tutores com o nome "${searchTerm}"`
              : 'Comece cadastrando seu primeiro tutor!'}
          </p>
          {!searchTerm && (
            <Link
              to={ROUTES.TUTORES.NEW}
              className="inline-flex px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cadastrar Tutor
            </Link>
          )}
        </div>
      )}

      {/* Tutor Grid */}
      {!isLoading && !isError && data && data.content.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.content.map((tutor) => (
              <TutorListCard key={tutor.id} tutor={tutor} onLinkPet={handleOpenLinkModal} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page + 1}
            totalPages={data.pageCount}
            onPageChange={handlePageChange}
          />

          {/* Results Info */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Mostrando {data.content.length} de {data.total} tutores
          </div>
        </>
      )}

      {/* Link Pet Modal */}
      {selectedTutor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleCloseLinkModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Vincular Pet</h2>
                <p className="text-sm text-gray-500">
                  Selecione um pet para vincular a {selectedTutor.nome}
                </p>
              </div>
              <button
                onClick={handleCloseLinkModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="p-4">
              {linkError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {linkError}
                </div>
              )}

              {/* Pet Search */}
              <input
                type="text"
                value={petSearchTerm}
                onChange={(e) => setPetSearchTerm(e.target.value)}
                placeholder="Buscar pet por nome..."
                className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />

              {/* Pet List */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {isLoadingPets ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : filteredAvailablePets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum pet disponivel para vincular</p>
                  </div>
                ) : (
                  filteredAvailablePets.map((pet) => (
                    <button
                      key={pet.id}
                      type="button"
                      onClick={() => handleLinkPet(pet)}
                      disabled={linkPetMutation.isPending}
                      className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <img
                        src={
                          pet.foto?.url ||
                          'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&q=80'
                        }
                        alt={pet.nome}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{pet.nome}</p>
                        {pet.raca && <p className="text-sm text-gray-500 truncate">{pet.raca}</p>}
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseLinkModal}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TutorListPage
