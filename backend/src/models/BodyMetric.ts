import { z } from 'zod'

export const bodyMetricCreateSchema = z.object({
  weight: z.number().positive(),
  bodyFat: z.number().min(0).max(80).optional(),
  muscle: z.number().min(0).max(120).optional(),
  height: z.number().positive().optional(),
  recordDate: z.string().date()
})

export const BODY_METRIC_MODEL_COUPLED_FIELDS = ['weight', 'body_fat', 'muscle', 'bmi', 'record_date']

