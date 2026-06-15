import { BookingStatusLabel } from './booking'
import { UserRoleLabel } from './user'

export const Messages = {
  USER_LOGIN_SUCCESS: 'User[phone] login success',
  USER_LOGIN_FAILED: 'User[phone] login failed: password_hash not match',
  USER_PROFILE_UPDATED: 'User[id] profile updated and dashboard refreshed',
  COURSE_CREATED: `Course[id] created by ${UserRoleLabel.coach}`,
  COURSE_LIST_EMPTY: 'Course[list] empty: show training discovery message',
  BOOKING_CREATED: `Booking[id] status=${BookingStatusLabel.pending} created`,
  BOOKING_CONFIRMED: `Booking[id] status=${BookingStatusLabel.confirmed} confirmed by coach`,
  BOOKING_COMPLETED: `Booking[id] status=${BookingStatusLabel.completed} completed`,
  BOOKING_CANCELLED: `Booking[id] status=${BookingStatusLabel.cancelled} cancelled`,
  BODY_METRIC_CREATED: 'BodyMetric[id] created and bmi recalculated',
  BODY_METRIC_TREND_EMPTY: 'BodyMetric[trend] empty: show first-record prompt',
  FRONTEND_TOAST_BOOKING_CREATED: '预约已提交，等待教练确认',
  FRONTEND_TOAST_BOOKING_CANCELLED: '预约已取消',
  FRONTEND_TOAST_PROFILE_SAVED: '资料已保存',
  BACKEND_RETURN_OK: 'FitPro request handled'
} as const

