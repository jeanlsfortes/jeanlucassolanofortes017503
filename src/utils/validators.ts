import { z } from 'zod'

export const petSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio').max(100, 'Nome muito longo'),
  raca: z.string().max(100, 'Raca muito longa').optional().or(z.literal('')),
  idade: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (val === '' || val === undefined || val === null) return undefined
      const num = typeof val === 'string' ? parseInt(val, 10) : val
      return isNaN(num) ? undefined : num
    })
    .pipe(z.number().min(0, 'Idade invalida').max(50, 'Idade invalida').optional())
    .optional(),
})

export const tutorSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio').max(200, 'Nome muito longo'),
  email: z.string().email('Email invalido').optional().or(z.literal('')),
  telefone: z
    .string()
    .optional()
    .or(z.literal(''))
    .transform((val) => val?.replace(/\D/g, '') || '')
    .pipe(
      z
        .string()
        .max(11, 'Telefone invalido')
        .optional()
        .or(z.literal(''))
    ),
  endereco: z.string().max(500, 'Endereco muito longo').optional().or(z.literal('')),
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export type PetFormData = z.infer<typeof petSchema>
export type TutorFormData = z.infer<typeof tutorSchema>
export type LoginFormData = z.infer<typeof loginSchema>

