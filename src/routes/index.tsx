import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from '@/@layouts/MainLayout'
import AuthLayout from '@/@layouts/AuthLayout'
import Loading from '@/components/shared/Loading/Loading'
import ProtectedRoute from '@/components/shared/ProtectedRoute/ProtectedRoute'
import GuestRoute from '@/components/shared/GuestRoute/GuestRoute'
import { ROUTES } from '@/@core/configs/routes.config'

// Lazy load routes
const HomePage = lazy(() => import('@/views/Home/HomePage'))
const PetDetailPage = lazy(() => import('@/views/PetDetail/PetDetailPage'))
const PetFormPage = lazy(() => import('@/views/PetForm/PetFormPage'))
const TutorListPage = lazy(() => import('@/views/TutorList/TutorListPage'))
const TutorFormPage = lazy(() => import('@/views/TutorForm/TutorFormPage'))
const LoginPage = lazy(() => import('@/views/Login/LoginPage'))

function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Guest routes - redirect to home if already authenticated */}
        <Route element={<GuestRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          </Route>
        </Route>

        {/* Protected routes - redirect to login if not authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.PETS.LIST} element={<HomePage />} />
            <Route path="/pets/:id" element={<PetDetailPage />} />
            <Route path={ROUTES.PETS.NEW} element={<PetFormPage />} />
            <Route path="/pets/:id/edit" element={<PetFormPage />} />
            <Route path={ROUTES.TUTORES.LIST} element={<TutorListPage />} />
            <Route path={ROUTES.TUTORES.NEW} element={<TutorFormPage />} />
            <Route path="/tutores/:id/edit" element={<TutorFormPage />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes

