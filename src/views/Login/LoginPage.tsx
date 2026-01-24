import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

import { loginSchema, type LoginFormData } from '@/utils/validators'
import { authService } from '@/api/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTES } from '@/@core/configs/routes.config'
import Input from '@/components/ui/Input/Input'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher/LanguageSwitcher'

const LoginPage = () => {
  const { t } = useTranslation()
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
        setApiError(t('login.invalidCredentials'))
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message)
      } else {
        setApiError(t('login.loginError'))
      }
    },
  })

  const onSubmit = (data: LoginFormData) => {
    setApiError(null)
    loginMutation.mutate(data)
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      {/* Language Switcher */}
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <Input
          label={t('login.email')}
          type="text"
          placeholder={t('login.emailPlaceholder')}
          error={errors.username?.message}
          {...register('username')}
        />

        <div>
          <Input
            label={t('login.password')}
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="mt-2 text-right">
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('login.forgotPassword')}
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-3 px-4 bg-[#162D3A] hover:bg-[#1a3847] text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? t('login.signingIn') : t('login.signIn')}
        </button>
      </form>

      {/* Sign up link */}
      <p className="mt-8 text-center text-sm text-gray-500">
        {t('login.noAccount')}{' '}
        <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
          {t('login.signUp')}
        </a>
      </p>

      {/* Footer */}
      <p className="mt-10 text-center text-xs text-gray-400 tracking-wide">
        © {new Date().getFullYear()} {t('login.allRightsReserved')}
      </p>
    </div>
  )
}

export default LoginPage
