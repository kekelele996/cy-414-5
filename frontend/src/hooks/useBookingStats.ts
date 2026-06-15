import { computed } from 'vue'
import { BookingStatus } from '@/constants/booking'
import { useBookingStore } from '@/stores/bookingStore'

export function useBookingStats() {
  const bookingStore = useBookingStore()
  const stats = computed(() => ({
    pending: bookingStore.list.filter(item => item.status === BookingStatus.PENDING).length,
    confirmed: bookingStore.list.filter(item => item.status === BookingStatus.CONFIRMED).length,
    completed: bookingStore.list.filter(item => item.status === BookingStatus.COMPLETED).length,
    cancelled: bookingStore.list.filter(item => item.status === BookingStatus.CANCELLED).length
  }))
  return { stats }
}

