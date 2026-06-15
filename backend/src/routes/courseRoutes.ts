import { Router } from 'express'
import { UserRole } from '../constants/user'
import { courseController } from '../controllers/courseController'
import { auth } from '../middlewares/auth'
import { generalRateLimiter } from '../middlewares/rateLimiter'
import { roleCheck } from '../middlewares/roleCheck'
import { asyncHandler } from '../utils/asyncHandler'

export const courseRoutes = Router()

courseRoutes.get('/courses', auth, generalRateLimiter, asyncHandler(courseController.list))
courseRoutes.get('/courses/recommended', auth, generalRateLimiter, asyncHandler(courseController.recommended))
courseRoutes.get('/courses/:id', auth, generalRateLimiter, asyncHandler(courseController.detail))
courseRoutes.post('/courses', auth, roleCheck([UserRole.COACH, UserRole.ADMIN]), generalRateLimiter, asyncHandler(courseController.create))
