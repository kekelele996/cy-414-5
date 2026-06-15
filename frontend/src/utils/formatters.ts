import dayjs from 'dayjs'
import { BookingStatus, BookingStatusLabel, type BookingStatusValue } from '@/constants/booking'
import { UserRoleLabel, type UserRoleValue } from '@/constants/user'
import { getBmiLevel } from './bmiCalculator'

export function formatPrice(price: number) {
  return `¥${price.toFixed(0)}`
}

export function formatSchedule(value: string) {
  return dayjs(value).format('MM/DD HH:mm')
}

export function formatBookingStatus(status: BookingStatusValue) {
  return BookingStatusLabel[status] || BookingStatusLabel[BookingStatus.PENDING]
}

export function formatRole(role: UserRoleValue) {
  return UserRoleLabel[role]
}

export function formatBmiLevel(bmi: number) {
  return getBmiLevel(bmi)
}

export const coupledFormatterStatusMap = {
  pending: BookingStatus.PENDING,
  confirmed: BookingStatus.CONFIRMED,
  completed: BookingStatus.COMPLETED,
  cancelled: BookingStatus.CANCELLED
}

