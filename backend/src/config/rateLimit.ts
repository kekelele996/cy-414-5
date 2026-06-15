export const rateLimitConfig = {
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.RATE_LIMIT_MAX || 120),
  authMax: Number(process.env.AUTH_RATE_LIMIT_MAX || 20),
  bookingMax: Number(process.env.BOOKING_RATE_LIMIT_MAX || 60)
}

