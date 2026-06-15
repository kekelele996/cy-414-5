import type { Response } from 'express'
import { BookingStatus } from '../constants/booking'
import { ErrorCodes } from '../constants/errorCodes'
import { UserRole } from '../constants/user'
import { bookingCreateSchema } from '../models/Booking'
import { bookingService } from '../services/bookingService'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'
import type { AuthedRequest } from '../types/auth'

export const bookingController = {
  async list(req: AuthedRequest, res: Response) {
    res.json(await bookingService.list(req.user?.id || 0, req.user?.role || UserRole.STUDENT))
  },

  async upcoming(req: AuthedRequest, res: Response) {
    res.json(await bookingService.upcoming(req.user?.id || 0, req.user?.role || UserRole.STUDENT))
  },

  async create(req: AuthedRequest, res: Response) {
    try {
      const payload = bookingCreateSchema.parse(req.body)
      res.status(201).json(await bookingService.create(req.user?.id || 0, payload))
    } catch (error) {
      logger.error('ERROR_HANDLER_CAUGHT', { entity: 'Booking', field: 'schedule_time', role: req.user?.role || UserRole.STUDENT, code: ErrorCodes.BOOKING_STATUS_PENDING_LOCKED })
      throw error instanceof AppError ? error : new AppError(`Booking[course_id=${req.body?.courseId}] create failed: schedule_time invalid role=${req.user?.role || UserRole.STUDENT}`, 400, ErrorCodes.BOOKING_STATUS_PENDING_LOCKED, 'Booking', 'schedule_time', req.user?.role || UserRole.STUDENT)
    }
  },

  async confirm(req: AuthedRequest, res: Response) {
    res.json(await bookingService.confirm(Number(req.params.id), req.user?.id || 0, req.user?.role || UserRole.COACH))
  },

  async complete(req: AuthedRequest, res: Response) {
    const role = req.user?.role || UserRole.STUDENT
    if (![UserRole.STUDENT, UserRole.COACH, UserRole.ADMIN].includes(role as any)) {
      throw new AppError(`Booking[id=${req.params.id}] ${BookingStatus.COMPLETED} failed: role invalid role=${role}`, 403, ErrorCodes.BOOKING_STATUS_COMPLETED_LOCKED, 'Booking', 'status', role)
    }
    res.json(await bookingService.complete(Number(req.params.id), req.user?.id || 0, role))
  },

  async cancel(req: AuthedRequest, res: Response) {
    res.json(await bookingService.cancel(Number(req.params.id), req.user?.id || 0, req.user?.role || UserRole.STUDENT))
  }
}

