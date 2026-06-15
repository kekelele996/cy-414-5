<template>
  <div class="section-band">
    <section class="grid-3">
      <div class="metric-tile">
        <span>待确认</span>
        <strong>{{ stats.pending }}</strong>
      </div>
      <div class="metric-tile">
        <span>已确认</span>
        <strong>{{ stats.confirmed }}</strong>
      </div>
      <div class="metric-tile">
        <span>已完成</span>
        <strong>{{ stats.completed }}</strong>
      </div>
    </section>

    <section v-if="bookingStore.list.length" class="list-stack">
      <article v-for="booking in bookingStore.list" :key="booking.id" class="booking-row">
        <div>
          <h3>{{ booking.course?.title || `课程 #${booking.courseId}` }}</h3>
          <p>{{ formatDateTime(booking.scheduleTime) }} · {{ booking.note || '无备注' }}</p>
        </div>
        <BookingStatusBadge :status="booking.status" />
        <div class="toolbar">
          <el-tooltip content="取消预约" placement="top">
            <el-button v-if="canCancel(booking.status)" :icon="XCircle" circle @click="bookingStore.setStatus(booking.id, BookingStatus.CANCELLED)" />
          </el-tooltip>
          <el-tooltip content="完成打卡" placement="top">
            <el-button v-if="canComplete(booking.status)" type="primary" :icon="CheckCircle2" circle @click="bookingStore.setStatus(booking.id, BookingStatus.COMPLETED)" />
          </el-tooltip>
        </div>
      </article>
    </section>
    <EmptyState v-else title="还没有预约" description="预约课程后会在这里跟踪确认和打卡状态" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { CheckCircle2, XCircle } from '@lucide/vue'
import BookingStatusBadge from '@/components/common/BookingStatusBadge.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { BookingActionVisibleMatrix, BookingStatus, type BookingStatusValue } from '@/constants/booking'
import { useBookingStats } from '@/hooks/useBookingStats'
import { useBookingStore } from '@/stores/bookingStore'
import { formatDateTime } from '@/utils/dateFormat'

const bookingStore = useBookingStore()
const { stats } = useBookingStats()

const canCancel = (status: BookingStatusValue) => BookingActionVisibleMatrix[status].includes('cancel')
const canComplete = (status: BookingStatusValue) => BookingActionVisibleMatrix[status].includes('complete')

onMounted(() => bookingStore.loadBookings())
</script>
