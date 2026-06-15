import type { Response } from 'express'
import { courseCreateSchema, courseQuerySchema } from '../models/Course'
import { ErrorCodes } from '../constants/errorCodes'
import { UserRole } from '../constants/user'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'
import { courseService } from '../services/courseService'
import type { AuthedRequest } from '../types/auth'

export const courseController = {
  async list(req: AuthedRequest, res: Response) {
    const query = courseQuerySchema.parse(req.query)
    res.json(await courseService.list(query))
  },

  async recommended(_req: AuthedRequest, res: Response) {
    res.json(await courseService.recommended())
  },

  async detail(req: AuthedRequest, res: Response) {
    const id = Number(req.params.id)
    res.json(await courseService.detail(id))
  },

  async create(req: AuthedRequest, res: Response) {
    try {
      const payload = courseCreateSchema.parse(req.body)
      res.status(201).json(await courseService.create(req.user?.id || 0, req.user?.role || UserRole.STUDENT, payload))
    } catch (error) {
      logger.error('ERROR_HANDLER_CAUGHT', { entity: 'Course', field: 'schedule', role: req.user?.role || 'anonymous', code: ErrorCodes.COURSE_COACH_REQUIRED })
      throw error instanceof AppError ? error : new AppError(`Course[coach_id=${req.user?.id}] create failed: schedule invalid role=${req.user?.role}`, 400, ErrorCodes.COURSE_COACH_REQUIRED, 'Course', 'schedule', req.user?.role || 'anonymous')
    }
  }
}

