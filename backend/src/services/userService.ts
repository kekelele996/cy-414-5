import bcrypt from 'bcryptjs'
import { prisma } from '../config/database'
import { ErrorCodes } from '../constants/errorCodes'
import { UserRole } from '../constants/user'
import { AppError } from '../utils/AppError'
import { signToken } from '../utils/jwt'
import { logger } from '../utils/logger'
import type { z } from 'zod'
import type { userLoginSchema, userProfileSchema, userRegisterSchema } from '../models/User'

function toUserDto(user: any) {
  return {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role,
    gender: user.gender,
    height: user.height === null ? null : Number(user.height),
    weight: user.weight === null ? null : Number(user.weight),
    createdAt: user.createdAt
  }
}

export const userService = {
  async register(payload: z.infer<typeof userRegisterSchema>) {
    logger.info('AUTH_REGISTER_START', { phone: payload.phone, role: payload.role })
    const exists = await prisma.user.findUnique({ where: { phone: payload.phone } })
    if (exists) {
      throw new AppError(`User[phone=${payload.phone}] register failed: phone exists role=${payload.role}`, 409, ErrorCodes.USER_PHONE_EXISTS, 'User', 'phone', payload.role)
    }
    const passwordHash = await bcrypt.hash(payload.password, 10)
    const user = await prisma.user.create({
      data: {
        phone: payload.phone,
        passwordHash,
        nickname: payload.nickname,
        role: payload.role || UserRole.STUDENT
      }
    })
    logger.info('AUTH_REGISTER_SUCCESS', { id: user.id, role: user.role })
    return { user: toUserDto(user), token: signToken({ id: user.id, phone: user.phone, role: user.role as any }) }
  },

  async login(payload: z.infer<typeof userLoginSchema>) {
    logger.info('AUTH_LOGIN_START', { phone: payload.phone, role: 'unknown' })
    const user = await prisma.user.findUnique({ where: { phone: payload.phone } })
    const ok = user ? await bcrypt.compare(payload.password, user.passwordHash) : false
    if (!user || !ok) {
      logger.warn('AUTH_LOGIN_FAILED', { phone: payload.phone })
      throw new AppError(`User[phone=${payload.phone}] login failed: password_hash not match role=anonymous`, 401, ErrorCodes.USER_LOGIN_FAILED, 'User', 'password_hash', 'anonymous')
    }
    logger.info('AUTH_LOGIN_SUCCESS', { phone: payload.phone, role: user.role })
    return { user: toUserDto(user), token: signToken({ id: user.id, phone: user.phone, role: user.role as any }) }
  },

  async getProfile(userId: number) {
    logger.info('USER_PROFILE_READ', { id: userId })
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new AppError(`User[id=${userId}] profile failed: id not found role=student`, 404, ErrorCodes.USER_PROFILE_INVALID, 'User', 'id', UserRole.STUDENT)
    }
    return toUserDto(user)
  },

  async updateProfile(userId: number, role: string, payload: z.infer<typeof userProfileSchema>) {
    logger.info('USER_PROFILE_UPDATE', { id: userId })
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          nickname: payload.nickname,
          avatar: payload.avatar,
          gender: payload.gender,
          height: payload.height,
          weight: payload.weight
        }
      })
      return toUserDto(user)
    } catch {
      throw new AppError(`User[id=${userId}] update failed: nickname/avatar/height invalid role=${role}`, 400, ErrorCodes.USER_PROFILE_INVALID, 'User', 'profile', role)
    }
  },

  async listCoaches() {
    const users = await prisma.user.findMany({ where: { role: UserRole.COACH }, orderBy: { createdAt: 'desc' } })
    return users.map(toUserDto)
  }
}

