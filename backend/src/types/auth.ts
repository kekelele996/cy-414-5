import type { Request } from 'express'
import type { UserRoleValue } from '../constants/user'

export interface AuthUser {
  id: number
  phone: string
  role: UserRoleValue
}

export interface AuthedRequest extends Request {
  user?: AuthUser
}

