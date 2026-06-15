import { prisma } from '../config/database'
import { ErrorCodes } from '../constants/errorCodes'
import { UserRole } from '../constants/user'
import { AppError } from '../utils/AppError'
import { bmiAdvice, calculateBmi } from '../utils/bmiCalculator'
import { logger } from '../utils/logger'
import type { z } from 'zod'
import type { bodyMetricCreateSchema } from '../models/BodyMetric'

function toMetricDto(metric: any) {
  const bmi = Number(metric.bmi)
  return {
    id: metric.id,
    userId: metric.userId,
    weight: Number(metric.weight),
    bodyFat: metric.bodyFat === null ? null : Number(metric.bodyFat),
    muscle: metric.muscle === null ? null : Number(metric.muscle),
    bmi,
    advice: bmiAdvice(bmi),
    recordDate: metric.recordDate,
    createdAt: metric.createdAt
  }
}

export const bodyMetricService = {
  async list(userId: number) {
    logger.info('BODY_METRIC_LIST', { userId })
    const metrics = await prisma.bodyMetric.findMany({
      where: { userId },
      orderBy: { recordDate: 'asc' }
    })
    return metrics.map(toMetricDto)
  },

  async create(userId: number, role: string, payload: z.infer<typeof bodyMetricCreateSchema>) {
    logger.info('BODY_METRIC_CREATE_START', { userId })
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const height = payload.height || (user?.height ? Number(user.height) : 0)
    const bmi = calculateBmi(height, payload.weight)
    if (!bmi) {
      throw new AppError(`BodyMetric[user_id=${userId}] create failed: height/weight invalid role=${role || UserRole.STUDENT}`, 400, ErrorCodes.BODY_METRIC_INVALID, 'BodyMetric', 'height', role)
    }
    const metric = await prisma.bodyMetric.create({
      data: {
        userId,
        weight: payload.weight,
        bodyFat: payload.bodyFat,
        muscle: payload.muscle,
        bmi,
        recordDate: new Date(payload.recordDate)
      }
    })
    logger.info('BODY_METRIC_CREATE_SUCCESS', { id: metric.id, bmi })
    return toMetricDto(metric)
  },

  async trend(userId: number) {
    const metrics = await this.list(userId)
    return metrics.map(metric => ({
      date: String(metric.recordDate).slice(0, 10),
      weight: metric.weight,
      bodyFat: metric.bodyFat,
      muscle: metric.muscle,
      bmi: metric.bmi,
      advice: metric.advice
    }))
  }
}

