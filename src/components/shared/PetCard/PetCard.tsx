import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Pet } from '@/api/types/pet.types'
import { ROUTES } from '@/@core/configs/routes.config'

interface PetCardProps {
  pet: Pet
  onDelete?: (pet: Pet) => void
}

const PetCard = ({ pet, onDelete }: PetCardProps) => {
  const { t } = useTranslation()
  const placeholderImage =
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80'

  return (
    <Link
      to={ROUTES.PETS.DETAIL(String(pet.id))}
      className="group block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary-200"
    >
      {/* Pet Image */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <img
          src={pet.foto?.url || placeholderImage}
          alt={pet.nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = placeholderImage
          }}
        />

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Delete button */}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(pet)
            }}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 shadow-lg z-10"
            title={t('pets.deletePetTooltip')}
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}

        {/* Pet name overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-xl font-bold text-white truncate drop-shadow-lg">
            {pet.nome}
          </h3>
        </div>
      </div>

      {/* Pet Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
          {pet.nome}
        </h3>

        <div className="mt-2 space-y-1">
          {pet.raca && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="truncate">{pet.raca}</span>
            </p>
          )}

          {pet.idade !== undefined && pet.idade !== null && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {pet.idade} {pet.idade === 1 ? t('common.year') : t('common.years')}
              </span>
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default PetCard
