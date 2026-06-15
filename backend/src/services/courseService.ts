import { Prisma } from '@prisma/client'
import { prisma } from '../config/database'
import { ErrorCodes } from '../constants/errorCodes'
import { UserRole } from '../constants/user'
import { AppError } from '../utils/AppError'
import { logger } from '../utils/logger'
import type { z } from 'zod'
import type { courseCreateSchema, courseQuerySchema } from '../models/Course'

function normalizeCourse(course: any) {
  return {
    id: course.id,
    coachId: course.coachId,
    title: course.title,
    description: course.description,
    duration: course.duration,
    price: Number(course.price),
    maxCapacity: course.maxCapacity,
    schedule: Array.isArray(course.schedule) ? course.schedule : [],
    status: course.status,
    createdAt: course.createdAt,
    coach: course.coach
      ? {
          id: course.coach.id,
          phone: course.coach.phone,
          nickname: course.coach.nickname,
          avatar: course.coach.avatar,
          role: course.coach.role
        }
      : undefined
  }
}

export const courseService = {
  async list(query: z.infer<typeof courseQuerySchema>) {
    logger.info('COURSE_LIST', { keyword: query.keyword || '', coachId: query.coachId || '' })
    const where: Prisma.CourseWhereInput = {
      status: 'published',
      ...(query.keyword
        ? {
            OR: [
              { title: { contains: query.keyword } },
              { description: { contains: query.keyword } },
              { coach: { nickname: { contains: query.keyword } } }
            ]
          }
        : {}),
      ...(query.coachId ? { coachId: query.coachId } : {})
    }
    const courses = await prisma.course.findMany({
      where,
      include: { coach: true },
      orderBy: { createdAt: 'desc' }
    })
    return courses.map(normalizeCourse)
  },

  async detail(id: number) {
    logger.info('COURSE_DETAIL', { id, role: UserRole.STUDENT })
    const course = await prisma.course.findUnique({ where: { id }, include: { coach: true } })
    if (!course) {
      throw new AppError(`Course[id=${id}] detail failed: id not found role=${UserRole.STUDENT}`, 404, ErrorCodes.COURSE_NOT_FOUND, 'Course', 'id', UserRole.STUDENT)
    }
    return normalizeCourse(course)
  },

  async create(coachId: number, role: string, payload: z.infer<typeof courseCreateSchema>) {
    logger.info('COURSE_CREATE_START', { title: payload.title })
    if (role !== UserRole.COACH && role !== UserRole.ADMIN) {
      throw new AppError(`Course[coach_id=${coachId}] create failed: role not ${UserRole.COACH}`, 403, ErrorCodes.COURSE_COACH_REQUIRED, 'Course', 'coach_id', role)
    }
    try {
      const course = await prisma.course.create({
        data: {
          coachId,
          title: payload.title,
          description: payload.description,
          duration: payload.duration,
          price: payload.price,
          maxCapacity: payload.maxCapacity,
          schedule: payload.schedule,
          status: payload.status
        },
        include: { coach: true }
      })
      logger.info('COURSE_CREATE_SUCCESS', { id: course.id, schedule: payload.schedule.join(',') })
      return normalizeCourse(course)
    } catch {
      logger.error('COURSE_CREATE_FAILED', { coachId })
      throw new AppError(`Course[coach_id=${coachId}] create failed: schedule invalid role=${role}`, 400, ErrorCodes.COURSE_COACH_REQUIRED, 'Course', 'schedule', role)
    }
  },

  async recommended() {
    const courses = await this.list({})
    return courses.slice(0, 3).map((course, index) => ({ ...course, reason: index === 0 ? '最近可约' : '训练匹配' }))
  }
}

