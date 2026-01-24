import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { petService } from '@/api/services/pet.service'
import { ROUTES } from '@/@core/configs/routes.config'
import PetCard from '@/components/shared/PetCard/PetCard'
import SearchInput from '@/components/ui/SearchInput/SearchInput'
import Pagination from '@/components/ui/Pagination/Pagination'
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal'
import type { Pet } from '@/api/types/pet.types'

const PAGE_SIZE = 10

const HomePage = () => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [nomeFilter, setNomeFilter] = useState('')
  const [racaFilter, setRacaFilter] = useState('')
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['pets', page, nomeFilter, racaFilter],
    queryFn: () =>
      petService.list({
        page,
        size: PAGE_SIZE,
        nome: nomeFilter || undefined,
        raca: racaFilter || undefined,
      }),
    staleTime: 1000 * 60, // 1 minute
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => petService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      setPetToDelete(null)
    },
  })

  const handleDeleteClick = useCallback((pet: Pet) => {
    setPetToDelete(pet)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (petToDelete) {
      deleteMutation.mutate(petToDelete.id)
    }
  }, [petToDelete, deleteMutation])

  const handleNomeChange = useCallback((value: string) => {
    setNomeFilter(value)
    setPage(0)
  }, [])

  const handleRacaChange = useCallback((value: string) => {
    setRacaFilter(value)
    setPage(0)
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage - 1) // API uses 0-based pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const hasActiveFilters = nomeFilter || racaFilter

  return (
    <div className="px-4 py-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 mb-8 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
            <defs>
              <pattern id="paw-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="2" fill="currentColor" />
                <circle cx="15" cy="5" r="2" fill="currentColor" />
                <circle cx="10" cy="12" r="3" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#paw-pattern)" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <span className="text-3xl">🐾</span>
              Lista de Pets
            </h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">
              Gerencie todos os pets cadastrados no sistema
            </p>
            {data && (
              <div className="flex items-center gap-4 mt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold">{data.total}</span>
                  <span className="text-gray-300 text-sm ml-2">
                    {data.total === 1 ? 'pet' : 'pets'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Link
            to={ROUTES.PETS.NEW}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Novo Pet</span>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="hidden sm:inline">Filtros:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <SearchInput
              value={nomeFilter}
              onChange={handleNomeChange}
              placeholder="Buscar por nome..."
              className="w-full sm:w-56"
            />
            <SearchInput
              value={racaFilter}
              onChange={handleRacaChange}
              placeholder="Filtrar por raca..."
              className="w-full sm:w-56"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setNomeFilter('')
                setRacaFilter('')
                setPage(0)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
          </div>
          <p className="mt-4 text-gray-500 text-sm">Carregando pets...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar</h3>
          <p className="text-red-600 text-sm mb-4">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data?.content.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? 'Nenhum pet encontrado' : 'Nenhum pet cadastrado'}
          </h3>
          <p className="text-gray-500 mb-6">
            {hasActiveFilters
              ? 'Nao encontramos pets com os filtros aplicados'
              : 'Comece cadastrando seu primeiro pet!'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={() => {
                setNomeFilter('')
                setRacaFilter('')
                setPage(0)
              }}
              className="inline-flex px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpar filtros
            </button>
          ) : (
            <Link
              to={ROUTES.PETS.NEW}
              className="inline-flex px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cadastrar Pet
            </Link>
          )}
        </div>
      )}

      {/* Pet Grid */}
      {!isLoading && !isError && data && data.content.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.content.map((pet) => (
              <PetCard key={pet.id} pet={pet} onDelete={handleDeleteClick} />
            ))}
          </div>

          {/* Pagination & Results Info */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <Pagination
              currentPage={page + 1}
              totalPages={data.pageCount}
              onPageChange={handlePageChange}
            />

            <p className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              Mostrando <span className="font-medium text-gray-700">{data.content.length}</span> de{' '}
              <span className="font-medium text-gray-700">{data.total}</span> pets
            </p>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!petToDelete}
        title="Excluir Pet"
        message={`Tem certeza que deseja excluir ${petToDelete?.nome || 'este pet'}? Esta acao nao pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPetToDelete(null)}
      />
    </div>
  )
}

export default HomePage

