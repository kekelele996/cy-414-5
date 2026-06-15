import { defineStore } from 'pinia'
import { bookingApi } from '@/api/booking'
import { BookingStatus, type BookingStatusValue } from '@/constants/booking'
import type { Booking } from '@/types/domain'
import { useCourseStore } from './courseStore'

const makeDemoBookings = (): Booking[] => {
  const courses = useCourseStore().list
  return [
    {
      id: 1,
      userId: 1,
      courseId: 1,
      scheduleTime: '2026-06-16T08:00:00+08:00',
      status: BookingStatus.CONFIRMED,
      note: '关注深蹲发力',
      course: courses[0]
    },
    {
      id: 2,
      userId: 1,
      courseId: 2,
      scheduleTime: '2026-06-19T19:30:00+08:00',
      status: BookingStatus.PENDING,
      note: '想做体态评估',
      course: courses[1]
    }
  ]
}

const activeBookingStatuses: BookingStatusValue[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED]

export const useBookingStore = defineStore('bookings', {
  state: () => ({
    list: [] as Booking[],
    upcoming: [] as Booking[]
  }),
  actions: {
    ensureDemo() {
      if (!this.list.length) this.list = makeDemoBookings()
      if (!this.upcoming.length) this.upcoming = this.list.filter(item => activeBookingStatuses.includes(item.status))
    },
    async loadBookings() {
      try {
        this.list = await bookingApi.list()
      } catch {
        this.list = makeDemoBookings()
      }
      this.upcoming = this.list.filter(item => activeBookingStatuses.includes(item.status))
    },
    async loadUpcoming() {
      try {
        this.upcoming = await bookingApi.upcoming()
      } catch {
        this.ensureDemo()
      }
    },
    async create(courseId: number, scheduleTime: string) {
      try {
        const booking = await bookingApi.create({ courseId, scheduleTime })
        this.list.unshift(booking)
      } catch {
        const course = useCourseStore().list.find(item => item.id === courseId)
        this.list.unshift({
          id: Date.now(),
          userId: 1,
          courseId,
          scheduleTime,
          status: BookingStatus.PENDING,
          course
        })
      }
      this.upcoming = this.list.filter(item => activeBookingStatuses.includes(item.status))
    },
    async setStatus(id: number, status: BookingStatusValue) {
      try {
        if (status === BookingStatus.CANCELLED) await bookingApi.cancel(id)
        if (status === BookingStatus.COMPLETED) await bookingApi.complete(id)
        if (status === BookingStatus.CONFIRMED) await bookingApi.confirm(id)
      } catch {
        const target = this.list.find(item => item.id === id)
        if (target) target.status = status
      }
      this.list = this.list.map(item => (item.id === id ? { ...item, status } : item))
      this.upcoming = this.list.filter(item => activeBookingStatuses.includes(item.status))
    }
  }
})
