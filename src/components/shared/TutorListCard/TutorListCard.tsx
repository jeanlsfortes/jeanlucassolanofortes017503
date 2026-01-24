import { Link } from 'react-router-dom'
import type { Tutor } from '@/api/types/tutor.types'
import { ROUTES } from '@/@core/configs/routes.config'

interface TutorListCardProps {
  tutor: Tutor
  onLinkPet?: (tutor: Tutor) => void
  onDelete?: (tutor: Tutor) => void
}

const TutorListCard = ({ tutor, onLinkPet, onDelete }: TutorListCardProps) => {
  const placeholderImage =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Tutor Header */}
      <div className="p-4 flex items-start gap-4">
        <Link to={ROUTES.TUTORES.EDIT(String(tutor.id))} className="flex-shrink-0">
          <img
            src={tutor.foto?.url || placeholderImage}
            alt={tutor.nome}
            className="w-16 h-16 rounded-full object-cover bg-gray-100"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = placeholderImage
            }}
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            to={ROUTES.TUTORES.EDIT(String(tutor.id))}
            className="text-lg font-semibold text-gray-900 hover:text-primary-600 truncate block"
          >
            {tutor.nome}
          </Link>

          <div className="mt-1 space-y-1">
            {tutor.email && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a href={`mailto:${tutor.email}`} className="truncate hover:text-primary-600">
                  {tutor.email}
                </a>
              </p>
            )}

            {tutor.telefone && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href={`tel:${tutor.telefone}`} className="hover:text-primary-600">
                  {tutor.telefone}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pets Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Pets ({tutor.pets?.length || 0})
          </span>
          {onLinkPet && (
            <button
              type="button"
              onClick={() => onLinkPet(tutor)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              + Vincular Pet
            </button>
          )}
        </div>

        {tutor.pets && tutor.pets.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tutor.pets.slice(0, 4).map((pet) => (
              <Link
                key={pet.id}
                to={ROUTES.PETS.DETAIL(String(pet.id))}
                className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded-full text-sm transition-colors"
              >
                <img
                  src={
                    pet.foto?.url ||
                    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&q=80'
                  }
                  alt={pet.nome}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-gray-700 truncate max-w-[80px]">{pet.nome}</span>
              </Link>
            ))}
            {tutor.pets.length > 4 && (
              <span className="text-xs text-gray-500 self-center">
                +{tutor.pets.length - 4} mais
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400">Nenhum pet vinculado</p>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <Link
          to={ROUTES.TUTORES.EDIT(String(tutor.id))}
          className="flex-1 text-center py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Editar
        </Link>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(tutor)}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Excluir
          </button>
        )}
      </div>
    </div>
  )
}

export default TutorListCard
