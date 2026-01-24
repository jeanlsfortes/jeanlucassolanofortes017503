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
      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Pet Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={pet.foto?.url || placeholderImage}
          alt={pet.nome}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = placeholderImage
          }}
        />
      </div>

      {/* Pet Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {pet.nome}
        </h3>

        <div className="mt-2 space-y-1">
          {pet.raca && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-medium">Raca:</span>
              <span className="truncate">{pet.raca}</span>
            </p>
          )}

          {pet.idade !== undefined && pet.idade !== null && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-medium">Idade:</span>
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
