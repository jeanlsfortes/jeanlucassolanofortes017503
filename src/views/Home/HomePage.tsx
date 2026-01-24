import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { petService } from '@/api/services/pet.service'
import { ROUTES } from '@/@core/configs/routes.config'
import PetCard from '@/components/shared/PetCard/PetCard'
import SearchInput from '@/components/ui/SearchInput/SearchInput'
import Pagination from '@/components/ui/Pagination/Pagination'

const PAGE_SIZE = 10

const HomePage = () => {
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['pets', page, searchTerm],
    queryFn: () =>
      petService.list({
        page,
        size: PAGE_SIZE,
        nome: searchTerm || undefined,
      }),
    staleTime: 1000 * 60, // 1 minute
  })

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setPage(0) // Reset to first page when searching
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage - 1) // API uses 0-based pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Lista de Pets
        </h1>

        <div className="flex items-center gap-3">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar por nome..."
            className="w-full sm:w-64"
          />

          <Link
            to={ROUTES.PETS.NEW}
            className="flex-shrink-0 px-4 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span className="hidden sm:inline">Novo Pet</span>
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
            Erro ao carregar pets:{' '}
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
          <div className="text-6xl mb-4">🐾</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum pet encontrado' : 'Nenhum pet cadastrado'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm
              ? `Nao encontramos pets com o nome "${searchTerm}"`
              : 'Comece cadastrando seu primeiro pet!'}
          </p>
          {!searchTerm && (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.content.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page + 1} // UI uses 1-based pages
            totalPages={data.pageCount}
            onPageChange={handlePageChange}
          />

          {/* Results Info */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Mostrando {data.content.length} de {data.total} pets
          </div>
        </>
      )}
    </div>
  )
}

export default HomePage

