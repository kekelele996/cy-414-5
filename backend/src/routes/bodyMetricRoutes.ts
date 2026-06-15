import { Router } from 'express'
import { UserRole } from '../constants/user'
import { bodyMetricController } from '../controllers/bodyMetricController'
import { auth } from '../middlewares/auth'
import { generalRateLimiter } from '../middlewares/rateLimiter'
import { roleCheck } from '../middlewares/roleCheck'
import { asyncHandler } from '../utils/asyncHandler'

export const bodyMetricRoutes = Router()

bodyMetricRoutes.get('/body-metrics', auth, roleCheck([UserRole.STUDENT, UserRole.ADMIN]), generalRateLimiter, asyncHandler(bodyMetricController.list))
bodyMetricRoutes.get('/body-metrics/trend', auth, roleCheck([UserRole.STUDENT, UserRole.ADMIN]), generalRateLimiter, asyncHandler(bodyMetricController.trend))
bodyMetricRoutes.post('/body-metrics', auth, roleCheck([UserRole.STUDENT, UserRole.ADMIN]), generalRateLimiter, asyncHandler(bodyMetricController.create))
