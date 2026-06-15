import { BookingStatus, BookingStatusLabel } from './booking'
import { UserRole, UserRoleLabel } from './user'

export const LOG_TEMPLATES = {
  AUTH_LOGIN_START: 'Auth[phone={phone}] login start role={role}',
  AUTH_LOGIN_SUCCESS: `Auth[phone={phone}] login success role=${UserRoleLabel.student}/${UserRoleLabel.coach}/${UserRoleLabel.admin}`,
  AUTH_LOGIN_FAILED: 'Auth[phone={phone}] login failed field=password_hash',
  AUTH_REGISTER_START: 'User[phone={phone}] register start role={role}',
  AUTH_REGISTER_SUCCESS: 'User[id={id}] register success role={role}',
  AUTH_TOKEN_VERIFY: 'Auth[token] verify User[id={id}] role={role}',
  AUTH_RBAC_ALLOW: 'RBAC allow User[id={id}] role={role} route={route}',
  AUTH_RBAC_DENY: 'RBAC deny User[id={id}] role={role} route={route}',
  USER_PROFILE_READ: 'User[id={id}] profile read fields=nickname/avatar/role',
  USER_PROFILE_UPDATE: 'User[id={id}] profile update fields=nickname/avatar/height/weight',
  COURSE_LIST: 'Course[list] query keyword={keyword} coachId={coachId}',
  COURSE_DETAIL: 'Course[id={id}] detail with coach role={role}',
  COURSE_CREATE_START: `Course[title={title}] create start requiredRole=${UserRole.COACH}`,
  COURSE_CREATE_SUCCESS: 'Course[id={id}] create success schedule={schedule}',
  COURSE_CREATE_FAILED: 'Course[coach_id={coachId}] create failed field=schedule',
  BOOKING_CREATE_START: `Booking[course_id={courseId}] create start status=${BookingStatus.PENDING}`,
  BOOKING_CREATE_SUCCESS: `Booking[id={id}] create success status=${BookingStatusLabel[BookingStatus.PENDING]}`,
  BOOKING_CREATE_FAILED: 'Booking[course_id={courseId}] create failed field=schedule_time role=student',
  BOOKING_LIST: 'Booking[list] query User[id={userId}] role={role}',
  BOOKING_CONFIRM_START: `Booking[id={id}] confirm start from=${BookingStatus.PENDING} to=${BookingStatus.CONFIRMED}`,
  BOOKING_CONFIRM_SUCCESS: `Booking[id={id}] confirm success status=${BookingStatusLabel[BookingStatus.CONFIRMED]}`,
  BOOKING_COMPLETE_START: `Booking[id={id}] complete start from=${BookingStatus.CONFIRMED} to=${BookingStatus.COMPLETED}`,
  BOOKING_COMPLETE_SUCCESS: `Booking[id={id}] complete success status=${BookingStatusLabel[BookingStatus.COMPLETED]}`,
  BOOKING_CANCEL_START: `Booking[id={id}] cancel start from=${BookingStatus.PENDING}/${BookingStatus.CONFIRMED}`,
  BOOKING_CANCEL_SUCCESS: `Booking[id={id}] cancel success status=${BookingStatusLabel[BookingStatus.CANCELLED]}`,
  BOOKING_TRANSITION_DENIED: 'Booking[id={id}] transition failed field=status role={role}',
  BODY_METRIC_LIST: 'BodyMetric[list] query User[id={userId}]',
  BODY_METRIC_CREATE_START: 'BodyMetric[user_id={userId}] create start fields=weight/body_fat/muscle/bmi',
  BODY_METRIC_CREATE_SUCCESS: 'BodyMetric[id={id}] create success bmi={bmi}',
  RATE_LIMIT_HIT: 'RateLimit[ip={ip}] route={route} code=RATE_LIMITED',
  ERROR_HANDLER_CAUGHT: 'ErrorHandler entity={entity} field={field} role={role} code={code}'
} as const

export type LogTemplateKey = keyof typeof LOG_TEMPLATES

