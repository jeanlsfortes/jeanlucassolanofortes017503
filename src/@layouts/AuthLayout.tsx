import { Outlet } from 'react-router-dom'

const PET_IMAGE_URL =
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80'

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Mobile: Image at top */}
      <div className="lg:hidden w-full p-4 pb-0">
        <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden shadow-lg">
          <img
            src={PET_IMAGE_URL}
            alt="Cute dog"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Desktop: Image on right side */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={PET_IMAGE_URL}
          alt="Cute dog"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay for better aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
      </div>
    </div>
  )
}

export default AuthLayout

