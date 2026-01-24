import { z } from 'zod'
import i18n from '@/i18n'

// Helper function to get translated validation messages
const t = (key: string) => i18n.t(key)

export const petSchema = z.object({
  nome: z
    .string()
    .min(1, { message: t('validation.nameRequired') })
    .max(100, { message: t('validation.nameTooLong') }),
  raca: z
    .string()
    .max(100, { message: t('validation.breedTooLong') })
    .optional()
    .or(z.literal('')),
  idade: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === '' || val === undefined || val === null) return undefined
      const num = typeof val === 'string' ? parseInt(val, 10) : val
      return isNaN(num) ? undefined : num
    })
    .pipe(
      z
        .number()
        .min(0, { message: t('validation.invalidAge') })
        .max(50, { message: t('validation.invalidAge') })
        .optional()
    )
    .optional(),
})

export const tutorSchema = z.object({
  nome: z
    .string()
    .min(1, { message: t('validation.nameRequired') })
    .max(200, { message: t('validation.nameTooLong') }),
  email: z
    .string()
    .email({ message: t('validation.invalidEmail') })
    .optional()
    .or(z.literal('')),
  telefone: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((val) => val?.replace(/\D/g, '') || '')
    .pipe(
      z
        .string()
        .max(11, { message: t('validation.invalidPhone') })
        .optional()
        .or(z.literal(''))
    ),
  endereco: z
    .string()
    .max(500, { message: t('validation.addressTooLong') })
    .optional()
    .or(z.literal('')),
})

export const loginSchema = z.object({
  username: z.string().min(1, { message: t('validation.usernameRequired') }),
  password: z.string().min(1, { message: t('validation.passwordRequired') }),
})

export type PetFormData = z.infer<typeof petSchema>
export type TutorFormData = z.infer<typeof tutorSchema>
export type LoginFormData = z.infer<typeof loginSchema>
