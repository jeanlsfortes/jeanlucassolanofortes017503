import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { loginSchema, type LoginFormData } from '@/utils/validators'
import { authService } from '@/api/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTES } from '@/@core/configs/routes.config'
import Input from '@/components/ui/Input/Input'

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      })
      navigate(ROUTES.HOME, { replace: true })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      if (error.response?.status === 401) {
        setApiError('Username ou senha invalidos')
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message)
      } else {
        setApiError('Erro ao realizar login. Tente novamente.')
      }
    },
  })

  const onSubmit = (data: LoginFormData) => {
    setApiError(null)
    loginMutation.mutate(data)
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          Welcome Back <span className="text-2xl">👋</span>
        </h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          Today is a new day. It's your day. You shape it.
          <br />
          Sign in to start managing your projects.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <Input
          label="Email"
          type="text"
          placeholder="Example@email.com"
          error={errors.username?.message}
          {...register('username')}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="mt-2 text-right">
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-3 px-4 bg-[#162D3A] hover:bg-[#1a3847] text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-400">Or</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Social Buttons */}
      <div className="flex flex-row gap-3">
        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Google</span>
        </button>

        <button
          type="button"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Facebook</span>
        </button>
      </div>

      {/* Sign up link */}
      <p className="mt-8 text-center text-sm text-gray-500">
        Don't you have an account?{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign up
        </a>
      </p>

      {/* Footer */}
      <p className="mt-10 text-center text-xs text-gray-400 tracking-wide">
        © {new Date().getFullYear()} ALL RIGHTS RESERVED
      </p>
    </div>
  )
}

export default LoginPage

