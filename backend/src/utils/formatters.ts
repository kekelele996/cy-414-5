import dayjs from 'dayjs'
import { BookingStatus, BookingStatusLabel, type BookingStatusValue } from '../constants/booking'
import { UserRoleLabel, type UserRoleValue } from '../constants/user'
import { bmiAdvice } from './bmiCalculator'

export function formatDateTime(value: Date | string) {
  return dayjs(value).format('YYYY-MM-DD HH:mm')
}

export function formatPrice(value: number) {
  return `¥${value.toFixed(2)}`
}

export function formatBookingStatus(status: BookingStatusValue) {
  return BookingStatusLabel[status] || BookingStatusLabel[BookingStatus.PENDING]
}

export function formatRole(role: UserRoleValue) {
  return UserRoleLabel[role]
}

export function formatBmiLevel(bmi: number) {
  return bmiAdvice(bmi)
}

export const formatterCouplingMap = {
  bookingPending: BookingStatus.PENDING,
  bookingConfirmed: BookingStatus.CONFIRMED,
  bookingCompleted: BookingStatus.COMPLETED,
  bookingCancelled: BookingStatus.CANCELLED,
  roleLabels: UserRoleLabel,
  statusLabels: BookingStatusLabel
}

