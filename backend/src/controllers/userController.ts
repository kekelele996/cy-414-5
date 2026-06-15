import type { Response } from 'express'
import { userLoginSchema, userProfileSchema, userRegisterSchema } from '../models/User'
import { ErrorCodes } from '../constants/errorCodes'
import { UserRole } from '../constants/user'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'
import { userService } from '../services/userService'
import type { AuthedRequest } from '../types/auth'

export const userController = {
  async register(req: AuthedRequest, res: Response) {
    try {
      const payload = userRegisterSchema.parse(req.body)
      res.status(201).json(await userService.register(payload))
    } catch (error) {
      logger.error('ERROR_HANDLER_CAUGHT', { entity: 'User', field: 'phone', role: req.body?.role || UserRole.STUDENT, code: ErrorCodes.USER_PHONE_EXISTS })
      throw error instanceof AppError ? error : new AppError(`User[phone=${req.body?.phone}] register failed: payload invalid role=${req.body?.role || UserRole.STUDENT}`, 400, ErrorCodes.USER_PROFILE_INVALID, 'User', 'phone', req.body?.role || UserRole.STUDENT)
    }
  },

  async login(req: AuthedRequest, res: Response) {
    try {
      const payload = userLoginSchema.parse(req.body)
      res.json(await userService.login(payload))
    } catch (error) {
      logger.error('ERROR_HANDLER_CAUGHT', { entity: 'User', field: 'password_hash', role: 'anonymous', code: ErrorCodes.USER_LOGIN_FAILED })
      throw error instanceof AppError ? error : new AppError(`User[phone=${req.body?.phone}] login failed: password_hash invalid role=anonymous`, 401, ErrorCodes.USER_LOGIN_FAILED, 'User', 'password_hash', 'anonymous')
    }
  },

  async me(req: AuthedRequest, res: Response) {
    const userId = req.user?.id || 0
    res.json(await userService.getProfile(userId))
  },

  async updateMe(req: AuthedRequest, res: Response) {
    try {
      const payload = userProfileSchema.parse(req.body)
      res.json(await userService.updateProfile(req.user?.id || 0, req.user?.role || UserRole.STUDENT, payload))
    } catch (error) {
      throw error instanceof AppError ? error : new AppError(`User[id=${req.user?.id}] update failed: profile invalid role=${req.user?.role}`, 400, ErrorCodes.USER_PROFILE_INVALID, 'User', 'profile', req.user?.role || 'anonymous')
    }
  },

  async coaches(_req: AuthedRequest, res: Response) {
    res.json(await userService.listCoaches())
  }
}

