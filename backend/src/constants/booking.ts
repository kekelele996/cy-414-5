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

export const BookingStatusTransitions: Record<BookingStatusValue, BookingStatusValue[]> = {
  [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
  [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: []
}

export const BookingStatusCoachActions = {
  confirm: [BookingStatus.PENDING],
  complete: [BookingStatus.CONFIRMED],
  reject: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
}

