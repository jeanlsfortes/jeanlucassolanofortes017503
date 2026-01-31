import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { tutorService } from '@/api/services/tutor.service'
import { ROUTES } from '@/@core/configs/routes.config'
import TutorListCard from '@/components/shared/TutorListCard/TutorListCard'
import PageHeader from '@/components/shared/PageHeader/PageHeader'
import SearchInput from '@/components/ui/SearchInput/SearchInput'
import PaginationWithInfo from '@/components/ui/PaginationWithInfo/PaginationWithInfo'
import ConfirmModal from '@/components/ui/ConfirmModal/ConfirmModal'
import LinkPetModal from '@/components/shared/LinkPetModal/LinkPetModal'
import type { Tutor } from '@/api/types/tutor.types'

const PAGE_SIZE = 10

const TutorListPage = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null)
  const [tutorToDelete, setTutorToDelete] = useState<Tutor | null>(null)

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

  // Delete tutor mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => tutorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutors'] })
      setTutorToDelete(null)
    },
  })

  const handleDeleteClick = useCallback((tutor: Tutor) => {
    setTutorToDelete(tutor)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (tutorToDelete) {
      deleteMutation.mutate(tutorToDelete.id)
    }
  }, [tutorToDelete, deleteMutation])

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value)
    setPage(0)
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (data && data.content.length === 0 && data.total > 0 && page >= data.pageCount) {
      setPage(Math.max(0, data.pageCount - 1))
    }
  }, [data, page])

  const handleOpenLinkModal = useCallback((tutor: Tutor) => {
    setSelectedTutor(tutor)
  }, [])

  const handleCloseLinkModal = useCallback(() => {
    setSelectedTutor(null)
  }, [])

  const hasActiveFilters = !!searchTerm

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <PageHeader
        title={t('tutors.title')}
        subtitle={t('tutors.subtitle')}
        icon="👥"
        count={data?.total}
        countLabel={data?.total === 1 ? t('tutors.tutor') : t('tutors.tutors')}
        actionLink={ROUTES.TUTORES.NEW}
        actionLabel={t('tutors.newTutor')}
        actionIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
        variant="tutors"
      />

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">{t('common.search')}</span>
          </div>

          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t('common.searchByName')}
            className="w-full sm:w-64"
          />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setPage(0)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t('common.clear')}
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-indigo-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="mt-4 text-gray-500 text-sm">{t('tutors.loadingTutors')}</p>
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
          <h3 className="text-lg font-medium text-red-800 mb-2">{t('tutors.loadError')}</h3>
          <p className="text-red-600 text-sm mb-4">
            {error instanceof Error ? error.message : t('common.unknownError')}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      )}

      {/* Empty State - only when truly no tutors (total === 0 or filters with no results) */}
      {!isLoading &&
        !isError &&
        data &&
        data.content.length === 0 &&
        (data.total === 0 || hasActiveFilters) && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? t('tutors.noTutorsFound') : t('tutors.noTutorsRegistered')}
            </h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters
                ? t('tutors.noFilterResults')
                : t('tutors.startRegistering')}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setPage(0)
                }}
                className="inline-flex px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('common.clearFilters')}
              </button>
            ) : (
              <Link
                to={ROUTES.TUTORES.NEW}
                className="inline-flex px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t('tutors.registerTutor')}
              </Link>
            )}
          </div>
        )}

      {/* Tutor Grid */}
      {!isLoading && !isError && data && data.content.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.content.map((tutor) => (
            <TutorListCard
              key={tutor.id}
              tutor={tutor}
              onLinkPet={handleOpenLinkModal}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Pagination - show when total > pageSize (even if current page content is empty) */}
      {!isLoading && !isError && data && data.total > PAGE_SIZE && (
        <PaginationWithInfo
          currentPage={page + 1}
          totalPages={data.pageCount}
          total={data.total}
          pageSize={PAGE_SIZE}
          itemCount={data.content.length}
          itemLabel={t('tutors.tutors')}
          onPageChange={handlePageChange}
        />
      )}

      {/* Info when total <= pageSize but has results */}
      {!isLoading && !isError && data && data.content.length > 0 && data.total <= PAGE_SIZE && (
        <p className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full mt-6 text-center">
          {t('common.showing', { current: data.content.length, total: data.total })} {t('tutors.tutors')}
        </p>
      )}

      {/* Link Pet Modal */}
      {selectedTutor && (
        <LinkPetModal
          tutor={selectedTutor}
          isOpen
          onClose={handleCloseLinkModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!tutorToDelete}
        title={t('tutors.deleteConfirmTitle')}
        message={t('tutors.deleteConfirmMessage', { name: tutorToDelete?.nome || 'este tutor' })}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTutorToDelete(null)}
      />
    </div>
  )
}

export default TutorListPage
