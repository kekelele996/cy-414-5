import type { NextFunction, Response } from 'express'
import { ErrorCodes } from '../constants/errorCodes'
import { UserRole, type UserRoleValue } from '../constants/user'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'
import type { AuthedRequest } from '../types/auth'

export function roleCheck(roles: UserRoleValue[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    const role = req.user?.role || UserRole.STUDENT
    if (!roles.includes(role)) {
      logger.warn('AUTH_RBAC_DENY', { id: req.user?.id || 0, role, route: req.path })
      return next(new AppError(`User[id=${req.user?.id}] route failed: role ${role} denied`, 403, ErrorCodes.AUTH_ROLE_DENIED_STUDENT, 'User', 'role', role))
    }
    logger.info('AUTH_RBAC_ALLOW', { id: req.user?.id || 0, role, route: req.path })
    next()
  }
}

