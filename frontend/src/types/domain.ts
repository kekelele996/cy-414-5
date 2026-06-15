import type { BookingStatusValue } from '@/constants/booking'
import type { UserRoleValue } from '@/constants/user'

export interface User {
  id: number
  phone: string
  nickname: string
  avatar?: string | null
  role: UserRoleValue
  gender?: string | null
  height?: number | null
  weight?: number | null
  createdAt?: string
}

export interface Course {
  id: number
  coachId: number
  title: string
  description?: string | null
  duration: number
  price: number
  maxCapacity: number
  schedule: string[]
  status: string
  createdAt?: string
  coach?: Pick<User, 'id' | 'nickname' | 'avatar' | 'role'>
  reason?: string
}

export interface Booking {
  id: number
  userId: number
  courseId: number
  scheduleTime: string
  status: BookingStatusValue
  note?: string | null
  course?: Course
}

export interface BodyMetric {
  id: number
  userId: number
  weight: number
  bodyFat?: number | null
  muscle?: number | null
  bmi: number
  advice?: string
  recordDate: string
}

export interface AuthPayload {
  user: User
  token: string
}

