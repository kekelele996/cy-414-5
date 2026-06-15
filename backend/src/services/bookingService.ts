import { prisma } from '../config/database'
import { BookingStatus, BookingStatusTransitions, type BookingStatusValue } from '../constants/booking'
import { ErrorCodes } from '../constants/errorCodes'
import { UserRole } from '../constants/user'
import { AppError } from '../utils/AppError'
import { formatBookingStatus } from '../utils/formatters'
import { logger } from '../utils/logger'
import type { z } from 'zod'
import type { bookingCreateSchema } from '../models/Booking'

function toBookingDto(booking: any) {
  return {
    id: booking.id,
    userId: booking.userId,
    courseId: booking.courseId,
    scheduleTime: booking.scheduleTime,
    status: booking.status,
    note: booking.note,
    createdAt: booking.createdAt,
    course: booking.course
      ? {
          id: booking.course.id,
          coachId: booking.course.coachId,
          title: booking.course.title,
          description: booking.course.description,
          duration: booking.course.duration,
          price: Number(booking.course.price),
          maxCapacity: booking.course.maxCapacity,
          schedule: Array.isArray(booking.course.schedule) ? booking.course.schedule : [],
          status: booking.course.status,
          coach: booking.course.coach
            ? {
                id: booking.course.coach.id,
                nickname: booking.course.coach.nickname,
                avatar: booking.course.coach.avatar,
                role: booking.course.coach.role
              }
            : undefined
        }
      : undefined
  }
}

function assertTransition(booking: any, nextStatus: BookingStatusValue, role: string) {
  const from = booking.status as BookingStatusValue
  const allowed = BookingStatusTransitions[from] || []
    if (!allowed.includes(nextStatus)) {
      logger.warn('BOOKING_TRANSITION_DENIED', { id: booking.id, role })
      throw new AppError(
      `Booking[id=${booking.id}] ${formatBookingStatus(from)}->${formatBookingStatus(nextStatus)} failed: status not allowed role=${role}`,
      409,
      ErrorCodes.BOOKING_TRANSITION_INVALID,
      'Booking',
      'status',
      role
    )
  }
}

export const bookingService = {
  async list(userId: number, role: string) {
    logger.info('BOOKING_LIST', { userId, role })
    const where = role === UserRole.COACH ? { course: { coachId: userId } } : role === UserRole.ADMIN ? {} : { userId }
    const bookings = await prisma.booking.findMany({
      where,
      include: { course: { include: { coach: true } } },
      orderBy: { scheduleTime: 'asc' }
    })
    return bookings.map(toBookingDto)
  },

  async upcoming(userId: number, role: string) {
    const bookings = await this.list(userId, role)
    return bookings.filter(item => [BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(item.status)).slice(0, 3)
  },

  async create(userId: number, payload: z.infer<typeof bookingCreateSchema>) {
    logger.info('BOOKING_CREATE_START', { courseId: payload.courseId })
    const course = await prisma.course.findUnique({ where: { id: payload.courseId } })
    if (!course) {
      logger.warn('BOOKING_CREATE_FAILED', { courseId: payload.courseId })
      throw new AppError(`Booking[course_id=${payload.courseId}] create failed: Course[id] missing role=${UserRole.STUDENT}`, 404, ErrorCodes.COURSE_NOT_FOUND, 'Booking', 'course_id', UserRole.STUDENT)
    }
    const booking = await prisma.booking.create({
      data: {
        userId,
        courseId: payload.courseId,
        scheduleTime: new Date(payload.scheduleTime),
        status: BookingStatus.PENDING,
        note: payload.note
      },
      include: { course: { include: { coach: true } } }
    })
    logger.info('BOOKING_CREATE_SUCCESS', { id: booking.id })
    return toBookingDto(booking)
  },

  async confirm(id: number, coachId: number, role: string) {
    logger.info('BOOKING_CONFIRM_START', { id })
    const booking = await prisma.booking.findUnique({ where: { id }, include: { course: true } })
    if (!booking) {
      throw new AppError(`Booking[id=${id}] confirm failed: id not found role=${role}`, 404, ErrorCodes.BOOKING_NOT_FOUND, 'Booking', 'id', role)
    }
    if (role === UserRole.COACH && booking.course.coachId !== coachId) {
      throw new AppError(`Booking[id=${id}] confirm failed: coach not match role=${role}`, 403, ErrorCodes.COURSE_COACH_REQUIRED, 'Booking', 'course.coach_id', role)
    }
    assertTransition(booking, BookingStatus.CONFIRMED, role)
    const updated = await prisma.booking.update({ where: { id }, data: { status: BookingStatus.CONFIRMED }, include: { course: { include: { coach: true } } } })
    logger.info('BOOKING_CONFIRM_SUCCESS', { id })
    return toBookingDto(updated)
  },

  async complete(id: number, userId: number, role: string) {
    logger.info('BOOKING_COMPLETE_START', { id })
    const booking = await prisma.booking.findUnique({ where: { id }, include: { course: true } })
    if (!booking) {
      throw new AppError(`Booking[id=${id}] complete failed: id not found role=${role}`, 404, ErrorCodes.BOOKING_NOT_FOUND, 'Booking', 'id', role)
    }
    if (role === UserRole.STUDENT && booking.userId !== userId) {
      throw new AppError(`Booking[id=${id}] complete failed: user_id not match role=${role}`, 403, ErrorCodes.BOOKING_NOT_FOUND, 'Booking', 'user_id', role)
    }
    assertTransition(booking, BookingStatus.COMPLETED, role)
    const updated = await prisma.booking.update({ where: { id }, data: { status: BookingStatus.COMPLETED }, include: { course: { include: { coach: true } } } })
    logger.info('BOOKING_COMPLETE_SUCCESS', { id })
    return toBookingDto(updated)
  },

  async cancel(id: number, userId: number, role: string) {
    logger.info('BOOKING_CANCEL_START', { id })
    const booking = await prisma.booking.findUnique({ where: { id }, include: { course: true } })
    if (!booking) {
      throw new AppError(`Booking[id=${id}] cancel failed: id not found role=${role}`, 404, ErrorCodes.BOOKING_NOT_FOUND, 'Booking', 'id', role)
    }
    const owner = role === UserRole.STUDENT && booking.userId === userId
    const coach = role === UserRole.COACH && booking.course.coachId === userId
    const admin = role === UserRole.ADMIN
    if (!owner && !coach && !admin) {
      throw new AppError(`Booking[id=${id}] cancel failed: owner/coach not match role=${role}`, 403, ErrorCodes.BOOKING_NOT_FOUND, 'Booking', 'user_id', role)
    }
    assertTransition(booking, BookingStatus.CANCELLED, role)
    const updated = await prisma.booking.update({ where: { id }, data: { status: BookingStatus.CANCELLED }, include: { course: { include: { coach: true } } } })
    logger.info('BOOKING_CANCEL_SUCCESS', { id })
    return toBookingDto(updated)
  }
}
