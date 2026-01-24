import { useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTES } from '@/@core/configs/routes.config'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher/LanguageSwitcher'

const MainLayout = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navLinks = [
    {
      to: ROUTES.PETS.LIST,
      label: t('nav.pets'),
      match: '/pets',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      pawIcon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 10.5c-1.5 0-2.5 1.5-2.5 3s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-3-2.5-3zm-4.5-3c-1 0-2 1-2 2s.5 2 1.5 2 2-.5 2-1.5-.5-2.5-1.5-2.5zm9 0c-1 0-1.5 1.5-1.5 2.5s1 1.5 2 1.5 1.5-1 1.5-2-1-2-2-2zm-9 8c-1 0-1.5 1-1.5 2s.5 1.5 1.5 1.5 2-.5 2-1.5-.5-2-2-2zm9 0c-1.5 0-2 1-2 2s.5 1.5 1.5 1.5 2-.5 2-1.5-.5-2-1.5-2z" />
        </svg>
      ),
    },
    {
      to: ROUTES.TUTORES.LIST,
      label: t('nav.tutors'),
      match: '/tutores',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to={ROUTES.HOME}
                className="flex items-center px-2 py-2 text-xl font-bold text-primary-600"
              >
                {t('nav.brand')}
              </Link>
              {/* Desktop Navigation */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                      isActiveRoute(link.match)
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-gray-900 hover:text-primary-600 hover:border-gray-300'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Desktop Logout */}
              <button
                onClick={handleLogout}
                className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                {t('nav.logout')}
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">{t('nav.openMenu')}</span>
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-center gap-3 py-4 text-base font-medium transition-colors ${
                    isActiveRoute(link.match)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 pb-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleLogout()
                }}
                className="flex items-center justify-center gap-3 w-full py-4 text-base font-medium text-red-600 hover:bg-red-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {t('nav.logout')}
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
