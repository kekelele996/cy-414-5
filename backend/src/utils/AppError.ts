import type { ErrorCode } from '../constants/errorCodes'

export class AppError extends Error {
  statusCode: number
  code: ErrorCode | string
  entity: string
  field: string
  role: string

  constructor(message: string, statusCode = 500, code: ErrorCode | string, entity = 'System', field = 'unknown', role = 'anonymous') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.entity = entity
    this.field = field
    this.role = role
  }
}

