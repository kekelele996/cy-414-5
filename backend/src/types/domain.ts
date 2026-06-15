import type { BookingStatusValue } from '../constants/booking'
import type { UserRoleValue } from '../constants/user'

export interface UserDto {
  id: number
  phone: string
  nickname: string
  avatar?: string | null
  role: UserRoleValue
  gender?: string | null
  height?: number | null
  weight?: number | null
  createdAt?: Date
}

export interface CourseDto {
  id: number
  coachId: number
  title: string
  description?: string | null
  duration: number
  price: number
  maxCapacity: number
  schedule: string[]
  status: string
  coach?: UserDto
}

export interface BookingDto {
  id: number
  userId: number
  courseId: number
  scheduleTime: string
  status: BookingStatusValue
  note?: string | null
  course?: CourseDto
}

