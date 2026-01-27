import { AxiosError } from 'axios'
import i18n from '@/i18n'
import type { ApiError } from '@/types/common.types'

/**
 * Extracts error message from various error types
 * Prioritizes API error messages, falls back to generic messages
 */
export function extractErrorMessage(
  error: unknown,
  defaultMessageKey?: string
): string {
  // Handle AxiosError with API response
  if (error instanceof AxiosError) {
    const responseData = error.response?.data as ApiError | undefined

    // Try to get message from API response
    if (responseData?.message) {
      return responseData.message
    }

    // Handle specific HTTP status codes
    if (error.response?.status === 401) {
      return i18n.t('login.invalidCredentials')
    }

    if (error.response?.status === 404) {
      return i18n.t('common.unknownError')
    }

    if (error.response?.status === 500) {
      return i18n.t('errors.unexpectedError')
    }

    // Fallback to error message if available
    if (error.message) {
      return error.message
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message
  }

  // Use default message if provided
  if (defaultMessageKey) {
    return i18n.t(defaultMessageKey)
  }

  // Ultimate fallback
  return i18n.t('common.unknownError')
}
