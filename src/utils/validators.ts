import { z } from 'zod'

export const petSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  especie: z.string().min(1, 'Espécie é obrigatória'),
  raca: z.string().optional(),
  idade: z.number().min(0).max(30).optional(),
})

export const tutorSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome completo é obrigatório').max(200, 'Nome muito longo'),
  telefone: z.string().min(10, 'Telefone inválido').max(15, 'Telefone inválido'),
  endereco: z.string().optional(),
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export type PetFormData = z.infer<typeof petSchema>
export type TutorFormData = z.infer<typeof tutorSchema>
export type LoginFormData = z.infer<typeof loginSchema>

