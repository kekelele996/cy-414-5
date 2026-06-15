import rateLimit from 'express-rate-limit'
import { rateLimitConfig } from '../config/rateLimit'
import { ErrorCodes } from '../constants/errorCodes'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'

function handler(req: any, _res: any, next: any) {
  logger.warn('RATE_LIMIT_HIT', { ip: req.ip, route: req.path })
  next(new AppError(`Request[ip=${req.ip}] limited: route=${req.path} role=anonymous`, 429, ErrorCodes.RATE_LIMITED, 'Request', 'ip', 'anonymous'))
}

export const generalRateLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler
})

export const authRateLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler
})

export const bookingRateLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.bookingMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler
})

