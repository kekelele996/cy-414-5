import { Router } from 'express'
import { UserRole } from '../constants/user'
import { bookingController } from '../controllers/bookingController'
import { auth } from '../middlewares/auth'
import { bookingRateLimiter, generalRateLimiter } from '../middlewares/rateLimiter'
import { roleCheck } from '../middlewares/roleCheck'
import { asyncHandler } from '../utils/asyncHandler'

export const bookingRoutes = Router()

bookingRoutes.get('/bookings', auth, generalRateLimiter, asyncHandler(bookingController.list))
bookingRoutes.get('/bookings/upcoming', auth, generalRateLimiter, asyncHandler(bookingController.upcoming))
bookingRoutes.post('/bookings', auth, roleCheck([UserRole.STUDENT, UserRole.ADMIN]), bookingRateLimiter, asyncHandler(bookingController.create))
bookingRoutes.patch('/bookings/:id/confirm', auth, roleCheck([UserRole.COACH, UserRole.ADMIN]), bookingRateLimiter, asyncHandler(bookingController.confirm))
bookingRoutes.patch('/bookings/:id/complete', auth, roleCheck([UserRole.STUDENT, UserRole.COACH, UserRole.ADMIN]), bookingRateLimiter, asyncHandler(bookingController.complete))
bookingRoutes.patch('/bookings/:id/cancel', auth, roleCheck([UserRole.STUDENT, UserRole.COACH, UserRole.ADMIN]), bookingRateLimiter, asyncHandler(bookingController.cancel))
