import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Pet } from '@/api/types/pet.types'
import { ROUTES } from '@/@core/configs/routes.config'

const PET_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&q=80'

interface LinkedPetsSelectorProps {
  linkedPets: Pet[]
  availablePets: Pet[]
  searchValue: string
  onSearchChange: (value: string) => void
  onLinkPet: (pet: Pet) => void
  onUnlinkPet: (petId: number) => void
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  isLinking?: boolean
  isUnlinking?: boolean
  variant?: 'inline' | 'modal'
  expanded?: boolean
  onToggleExpand?: () => void
  onLinkClick?: () => void
  allPetsCount?: number
  showLinkButton?: boolean
}

const LinkedPetsSelector = ({
  linkedPets,
  availablePets,
  searchValue,
  onSearchChange,
  onLinkPet,
  onUnlinkPet,
  isLoading = false,
  isError = false,
  error = null,
  onRetry,
  isLinking = false,
  isUnlinking = false,
  variant = 'inline',
  expanded = true,
  onToggleExpand,
  onLinkClick,
  allPetsCount = 0,
  showLinkButton = true,
}: LinkedPetsSelectorProps) => {
  const { t } = useTranslation()
  const isCompact = variant === 'inline'

  const showSearch = expanded && !onLinkClick
  const hasNoPetsInSystem = allPetsCount === 0 && !searchValue
  const allAlreadyLinked = allPetsCount > 0 && availablePets.length === 0 && linkedPets.length > 0

  return (
    <div
      className={
        isCompact
          ? 'bg-white rounded-lg border border-gray-200 p-4'
          : 'space-y-4'
      }
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {t('tutors.linkedPets')}
        </h2>
        {showLinkButton && (onLinkClick || onToggleExpand) && (
          <button
            type="button"
            onClick={onLinkClick ?? onToggleExpand}
            className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            {t('tutors.linkPet')}
          </button>
        )}
      </div>

      {/* Linked pets - shown first */}
      <div
        className={`space-y-2 mb-4 overflow-y-auto ${
          isCompact ? 'max-h-48' : 'max-h-64'
        }`}
      >
        {linkedPets.length > 0 ? (
          linkedPets.map((pet) => (
            <div
              key={pet.id}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
            >
              <Link to={ROUTES.PETS.DETAIL(String(pet.id))} className="flex-shrink-0">
                <img
                  src={pet.foto?.url || PET_PLACEHOLDER_IMAGE}
                  alt={pet.nome}
                  className={`rounded-full object-cover ${
                    isCompact ? 'w-10 h-10' : 'w-12 h-12'
                  }`}
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={ROUTES.PETS.DETAIL(String(pet.id))}
                  className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate block"
                >
                  {pet.nome}
                </Link>
                {pet.raca && (
                  <p className="text-xs text-gray-500 truncate">{pet.raca}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onUnlinkPet(pet.id)}
                disabled={isUnlinking}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                title={t('tutors.removeLink')}
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
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-2">
            {t('tutors.noPetsLinked')}
          </p>
        )}
      </div>

      {showSearch && (
        <div className={isCompact ? 'mb-4 p-3 bg-gray-50 rounded-lg' : ''}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('tutors.searchPetByName')}
            className={`w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              isCompact ? 'text-sm mb-2' : 'rounded-lg mb-4'
            }`}
          />

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-600 text-sm mb-4">
                {error instanceof Error ? error.message : t('tutors.loadPetsError')}
              </p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                >
                  {t('common.tryAgain')}
                </button>
              )}
            </div>
          ) : availablePets.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              {hasNoPetsInSystem
                ? t('tutors.noPetsAvailableShort')
                : allAlreadyLinked
                  ? t('tutors.allPetsAlreadyLinked')
                  : t('tutors.noPetsAvailableShort')}
            </div>
          ) : (
            <div
              className={`space-y-1 overflow-y-auto ${
                isCompact ? 'max-h-40' : 'max-h-48'
              }`}
            >
              {availablePets.map((pet) => (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => onLinkPet(pet)}
                  disabled={isLinking}
                  className={`w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 ${
                    isCompact ? 'gap-2 p-2' : ''
                  }`}
                >
                  <img
                    src={pet.foto?.url || PET_PLACEHOLDER_IMAGE}
                    alt={pet.nome}
                    className={`rounded-full object-cover ${
                      isCompact ? 'w-8 h-8' : 'w-12 h-12'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium text-gray-900 truncate ${
                        isCompact ? 'text-sm' : ''
                      }`}
                    >
                      {pet.nome}
                    </p>
                    {pet.raca && (
                      <p
                        className={`text-gray-500 truncate ${
                          isCompact ? 'text-xs' : 'text-sm'
                        }`}
                      >
                        {pet.raca}
                      </p>
                    )}
                  </div>
                  {!isCompact && (
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
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LinkedPetsSelector
