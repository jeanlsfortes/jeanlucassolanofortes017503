import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  icon: string
  count?: number
  countLabel?: string
  actionLink?: string
  actionLabel?: string
  actionIcon?: ReactNode
  variant?: 'pets' | 'tutors' | 'default'
}

const PageHeader = ({
  title,
  subtitle,
  icon,
  count,
  countLabel = 'itens',
  actionLink,
  actionLabel,
  actionIcon,
  variant = 'default',
}: PageHeaderProps) => {
  const gradients = {
    pets: 'from-gray-900 via-gray-800 to-gray-900',
    tutors: 'from-indigo-900 via-indigo-800 to-purple-900',
    default: 'from-gray-900 via-gray-800 to-gray-900',
  }

  const patterns = {
    pets: (
      <>
        <defs>
          <pattern id="paw-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="2" fill="currentColor" />
            <circle cx="15" cy="5" r="2" fill="currentColor" />
            <circle cx="10" cy="12" r="3" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#paw-pattern)" />
      </>
    ),
    tutors: (
      <>
        <defs>
          <pattern id="people-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
            <circle cx="12.5" cy="8" r="4" fill="currentColor" />
            <path d="M5 22 Q12.5 15 20 22" stroke="currentColor" strokeWidth="2" fill="none" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#people-pattern)" />
      </>
    ),
    default: null,
  }

  return (
    <div
      className={`bg-gradient-to-r ${gradients[variant]} rounded-2xl p-6 sm:p-8 mb-8 text-white relative overflow-hidden`}
    >
      {/* Background pattern */}
      {patterns[variant] && (
        <div className="absolute inset-0 opacity-10">{patterns[variant]}</div>
      )}

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            {title}
          </h1>
          <p className="text-gray-300 mt-2 text-sm sm:text-base">{subtitle}</p>
          {count !== undefined && (
            <div className="flex items-center gap-4 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-2xl font-bold">{count}</span>
                <span className="text-gray-300 text-sm ml-2">{countLabel}</span>
              </div>
            </div>
          )}
        </div>

        {actionLink && actionLabel && (
          <Link
            to={actionLink}
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {actionIcon}
            <span>{actionLabel}</span>
          </Link>
        )}
      </div>
    </div>
  )
}

export default PageHeader
