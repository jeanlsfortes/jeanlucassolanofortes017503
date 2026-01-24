import { Link } from 'react-router-dom'
import type { Pet } from '@/api/types/pet.types'
import { ROUTES } from '@/@core/configs/routes.config'

interface PetCardProps {
  pet: Pet
}

const PetCard = ({ pet }: PetCardProps) => {
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

        {/* View icon on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

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
                {pet.idade} {pet.idade === 1 ? 'ano' : 'anos'}
              </span>
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default PetCard
