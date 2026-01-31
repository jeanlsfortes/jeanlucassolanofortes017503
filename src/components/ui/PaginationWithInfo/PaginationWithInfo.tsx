import { useTranslation } from 'react-i18next'
import Pagination from '../Pagination/Pagination'

export interface PaginationWithInfoProps {
  currentPage: number
  totalPages: number
  total: number
  pageSize: number
  itemCount: number
  itemLabel: string
  onPageChange: (page: number) => void
}

const PaginationWithInfo = ({
  currentPage,
  totalPages,
  total,
  pageSize,
  itemCount,
  itemLabel,
  onPageChange,
}: PaginationWithInfoProps) => {
  const { t } = useTranslation()
  const safeTotalPages = Math.max(1, totalPages)

  const shouldShowPagination = total > pageSize

  if (!shouldShowPagination) {
    return (
      <p className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full mt-6">
        {t('common.showing', { current: itemCount, total })} {itemLabel}
      </p>
    )
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <Pagination
        currentPage={currentPage}
        totalPages={safeTotalPages}
        onPageChange={onPageChange}
      />
      <p className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
        {t('common.showing', { current: itemCount, total })} {itemLabel}
      </p>
    </div>
  )
}

export default PaginationWithInfo
