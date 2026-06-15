import type { NextFunction, Request, Response } from 'express'
import { ErrorCodes } from '../constants/errorCodes'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Route[path=${req.path}] failed: not found role=anonymous`, 404, ErrorCodes.INTERNAL_ERROR, 'Route', 'path', 'anonymous'))
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  const appError = error instanceof AppError ? error : new AppError(error.message || 'Internal error', 500, ErrorCodes.INTERNAL_ERROR)
  logger.error('ERROR_HANDLER_CAUGHT', {
    entity: appError.entity,
    field: appError.field,
    role: appError.role,
    code: appError.code
  })
  res.status(appError.statusCode).json({
    code: appError.code,
    message: appError.message,
    entity: appError.entity,
    field: appError.field,
    role: appError.role
  })
}

