import { Router } from 'express'
import { userController } from '../controllers/userController'
import { auth } from '../middlewares/auth'
import { authRateLimiter, generalRateLimiter } from '../middlewares/rateLimiter'
import { roleCheck } from '../middlewares/roleCheck'
import { UserRole } from '../constants/user'
import { asyncHandler } from '../utils/asyncHandler'

export const userRoutes = Router()

userRoutes.post('/auth/register', authRateLimiter, asyncHandler(userController.register))
userRoutes.post('/auth/login', authRateLimiter, asyncHandler(userController.login))
userRoutes.get('/users/me', auth, generalRateLimiter, asyncHandler(userController.me))
userRoutes.put('/users/me', auth, generalRateLimiter, asyncHandler(userController.updateMe))
userRoutes.get('/users/coaches', auth, roleCheck([UserRole.STUDENT, UserRole.COACH, UserRole.ADMIN]), generalRateLimiter, asyncHandler(userController.coaches))
