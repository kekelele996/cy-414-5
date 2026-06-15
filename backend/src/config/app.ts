import dotenv from 'dotenv'

dotenv.config()

export const appConfig = {
  port: Number(process.env.PORT || 3000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:18414',
  jwtSecret: process.env.JWT_SECRET || 'change_me_to_a_long_random_string',
  nodeEnv: process.env.NODE_ENV || 'development'
}

