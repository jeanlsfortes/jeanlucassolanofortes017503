import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from '@/@layouts/MainLayout'
import AuthLayout from '@/@layouts/AuthLayout'
import Loading from '@/components/shared/Loading/Loading'
import ProtectedRoute from '@/components/shared/ProtectedRoute/ProtectedRoute'

// Lazy load routes
const HomePage = lazy(() => import('@/views/Home/HomePage'))
const PetDetailPage = lazy(() => import('@/views/PetDetail/PetDetailPage'))
const PetFormPage = lazy(() => import('@/views/PetForm/PetFormPage'))
const TutorFormPage = lazy(() => import('@/views/TutorForm/TutorFormPage'))
const LoginPage = lazy(() => import('@/views/Login/LoginPage'))

function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pets" element={<HomePage />} />
            <Route path="/pets/:id" element={<PetDetailPage />} />
            <Route path="/pets/new" element={<PetFormPage />} />
            <Route path="/pets/:id/edit" element={<PetFormPage />} />
            <Route path="/tutores/new" element={<TutorFormPage />} />
            <Route path="/tutores/:id/edit" element={<TutorFormPage />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes

