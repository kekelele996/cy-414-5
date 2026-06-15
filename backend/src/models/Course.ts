import { z } from 'zod'

export const courseCreateSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(2000).optional(),
  duration: z.number().int().min(15).max(240),
  price: z.number().min(0),
  maxCapacity: z.number().int().min(1).max(99),
  schedule: z.array(z.string().datetime({ offset: true })).min(1),
  status: z.enum(['draft', 'published', 'archived']).default('published')
})

export const courseQuerySchema = z.object({
  keyword: z.string().optional(),
  coachId: z.coerce.number().int().positive().optional()
})

export const COURSE_MODEL_COUPLED_FIELDS = ['coach_id', 'schedule', 'status', 'price', 'max_capacity']

