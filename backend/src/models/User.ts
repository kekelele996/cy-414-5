import { z } from 'zod'
import { UserRole } from '../constants/user'

export const userRegisterSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(6),
  nickname: z.string().min(1).max(80),
  role: z.enum([UserRole.STUDENT, UserRole.COACH, UserRole.ADMIN]).default(UserRole.STUDENT)
})

export const userLoginSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(6)
})

export const userProfileSchema = z.object({
  nickname: z.string().min(1).max(80).optional(),
  avatar: z.string().url().nullable().optional(),
  gender: z.string().nullable().optional(),
  height: z.number().positive().nullable().optional(),
  weight: z.number().positive().nullable().optional()
})

export const USER_MODEL_ENUM_LOCATIONS = ['Prisma.UserRole', 'constants/user.ts', 'routes/userRoutes.ts', 'middlewares/roleCheck.ts']

