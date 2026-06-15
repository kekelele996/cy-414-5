import { BookingStatusLabel } from './booking'
import { UserRoleLabel } from './user'

export const Messages = {
  FRONTEND_BOOKING_CREATED: `预约已提交，当前为${BookingStatusLabel.pending}`,
  FRONTEND_BOOKING_CANCELLED: `预约已更新为${BookingStatusLabel.cancelled}`,
  FRONTEND_PROFILE_SAVED: `资料已保存，角色文案来自 ${UserRoleLabel.student}/${UserRoleLabel.coach}`,
  FRONTEND_EMPTY_COURSE: '暂无符合条件的课程',
  BACKEND_RETURN_OK: 'FitPro request handled',
  LOG_BOOKING_STATUS_CHANGED: `Booking status text: ${BookingStatusLabel.pending}/${BookingStatusLabel.confirmed}/${BookingStatusLabel.completed}/${BookingStatusLabel.cancelled}`
} as const

