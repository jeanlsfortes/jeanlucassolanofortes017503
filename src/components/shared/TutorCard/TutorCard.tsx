import type { TutorEmbed } from '@/api/types/pet.types'

interface TutorCardProps {
  tutor: TutorEmbed
}

const TutorCard = ({ tutor }: TutorCardProps) => {
  const placeholderImage =
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80'

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Tutor Photo */}
      <div className="flex-shrink-0">
        <img
          src={tutor.foto?.url || placeholderImage}
          alt={tutor.nome}
          className="w-16 h-16 rounded-full object-cover bg-gray-100"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = placeholderImage
          }}
        />
      </div>

      {/* Tutor Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-gray-900 truncate">
          {tutor.nome}
        </h4>

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
              <a
                href={`mailto:${tutor.email}`}
                className="truncate hover:text-primary-600"
              >
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
              <a
                href={`tel:${tutor.telefone}`}
                className="hover:text-primary-600"
              >
                {tutor.telefone}
              </a>
            </p>
          )}

          {tutor.endereco && (
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="truncate">{tutor.endereco}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default TutorCard
