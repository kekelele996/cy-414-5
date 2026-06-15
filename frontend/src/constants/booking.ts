export const BookingStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

export type BookingStatusValue = (typeof BookingStatus)[keyof typeof BookingStatus]

export const BookingStatusLabel: Record<BookingStatusValue, string> = {
  [BookingStatus.PENDING]: '待确认',
  [BookingStatus.CONFIRMED]: '已确认',
  [BookingStatus.COMPLETED]: '已完成',
  [BookingStatus.CANCELLED]: '已取消'
}

export const BookingStatusTone: Record<BookingStatusValue, 'warning' | 'success' | 'info' | 'danger'> = {
  [BookingStatus.PENDING]: 'warning',
  [BookingStatus.CONFIRMED]: 'success',
  [BookingStatus.COMPLETED]: 'info',
  [BookingStatus.CANCELLED]: 'danger'
}

export const BookingActionVisibleMatrix: Record<BookingStatusValue, string[]> = {
  [BookingStatus.PENDING]: ['cancel', 'confirm'],
  [BookingStatus.CONFIRMED]: ['cancel', 'complete'],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: []
}

