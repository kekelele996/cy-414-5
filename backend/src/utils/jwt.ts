import jwt from 'jsonwebtoken'
import { appConfig } from '../config/app'
import type { UserRoleValue } from '../constants/user'

export interface JwtPayload {
  id: number
  phone: string
  role: UserRoleValue
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, appConfig.jwtSecret, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  return jwt.verify(token, appConfig.jwtSecret) as JwtPayload
}

