import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  maxVisible?: number
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) => {
  const { t } = useTranslation()

  // Calculate which pages to show
  const pages = useMemo(() => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisible / 2)
    let start = currentPage - half
    let end = currentPage + half

    if (start < 1) {
      start = 1
      end = maxVisible
    }

    if (end > totalPages) {
      end = totalPages
      start = totalPages - maxVisible + 1
    }

    const result: (number | 'ellipsis-start' | 'ellipsis-end')[] = []

    // Add first page and ellipsis if needed
    if (start > 1) {
      result.push(1)
      if (start > 2) {
        result.push('ellipsis-start')
      }
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      if (i > 0 && i <= totalPages) {
        result.push(i)
      }
    }

    // Add last page and ellipsis if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        result.push('ellipsis-end')
      }
      result.push(totalPages)
    }

    return result
  }, [currentPage, totalPages, maxVisible])

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        <span className="hidden sm:inline">{t('common.previous')}</span>
        <span className="sm:hidden">&lt;</span>
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <span
              key={page}
              className="px-3 py-2 text-sm text-gray-500"
            >
              ...
            </span>
          )
        }

        return (
          <button
            key={`page-${page}-${index}`}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        <span className="hidden sm:inline">{t('common.next')}</span>
        <span className="sm:hidden">&gt;</span>
      </button>
    </div>
  )
}

export default Pagination
