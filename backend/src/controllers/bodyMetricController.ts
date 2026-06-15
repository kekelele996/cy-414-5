import type { Response } from 'express'
import { ErrorCodes } from '../constants/errorCodes'
import { UserRole } from '../constants/user'
import { bodyMetricCreateSchema } from '../models/BodyMetric'
import { bodyMetricService } from '../services/bodyMetricService'
import { AppError } from '../utils/AppError'
import type { AuthedRequest } from '../types/auth'

export const bodyMetricController = {
  async list(req: AuthedRequest, res: Response) {
    res.json(await bodyMetricService.list(req.user?.id || 0))
  },

  async trend(req: AuthedRequest, res: Response) {
    res.json(await bodyMetricService.trend(req.user?.id || 0))
  },

  async create(req: AuthedRequest, res: Response) {
    try {
      const payload = bodyMetricCreateSchema.parse(req.body)
      res.status(201).json(await bodyMetricService.create(req.user?.id || 0, req.user?.role || UserRole.STUDENT, payload))
    } catch (error) {
      throw error instanceof AppError ? error : new AppError(`BodyMetric[user_id=${req.user?.id}] create failed: weight/body_fat invalid role=${req.user?.role}`, 400, ErrorCodes.BODY_METRIC_INVALID, 'BodyMetric', 'weight', req.user?.role || UserRole.STUDENT)
    }
  }
}

