import type { NextFunction, Response } from 'express'
import { ErrorCodes } from '../constants/errorCodes'
import { UserRole } from '../constants/user'
import { AppError } from '../utils/AppError'
import { verifyToken } from '../utils/jwt'
import { logger } from '../utils/logger'
import type { AuthedRequest } from '../types/auth'

export function auth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('User[id=anonymous] auth failed: token missing role=anonymous', 401, ErrorCodes.AUTH_TOKEN_MISSING, 'User', 'authorization', 'anonymous'))
  }
  try {
    const payload = verifyToken(header.slice(7))
    req.user = payload
    logger.info('AUTH_TOKEN_VERIFY', { id: payload.id, role: payload.role || UserRole.STUDENT })
    next()
  } catch {
    next(new AppError('User[id=anonymous] auth failed: token invalid role=anonymous', 401, ErrorCodes.AUTH_TOKEN_INVALID, 'User', 'authorization', 'anonymous'))
  }
}
