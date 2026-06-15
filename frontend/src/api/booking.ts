import { request } from '@/utils/request'
import type { Booking } from '@/types/domain'

export const bookingApi = {
  list() {
    return request.get<unknown, Booking[]>('/bookings')
  },
  upcoming() {
    return request.get<unknown, Booking[]>('/bookings/upcoming')
  },
  create(payload: { courseId: number; scheduleTime: string; note?: string }) {
    return request.post<unknown, Booking>('/bookings', payload)
  },
  confirm(id: number) {
    return request.patch<unknown, Booking>(`/bookings/${id}/confirm`)
  },
  complete(id: number) {
    return request.patch<unknown, Booking>(`/bookings/${id}/complete`)
  },
  cancel(id: number) {
    return request.patch<unknown, Booking>(`/bookings/${id}/cancel`)
  }
}

