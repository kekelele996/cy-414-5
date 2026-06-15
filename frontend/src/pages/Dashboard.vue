<template>
  <div class="section-band">
    <section class="grid-3">
      <div class="metric-tile">
        <span>待确认预约</span>
        <strong>{{ stats.pending }}</strong>
      </div>
      <div class="metric-tile">
        <span>已确认课程</span>
        <strong>{{ stats.confirmed }}</strong>
      </div>
      <div class="metric-tile">
        <span>最新 BMI</span>
        <strong>{{ latestMetric?.bmi || '-' }}</strong>
      </div>
    </section>

    <section class="grid-2">
      <div class="section-band">
        <div class="section-title">
          <h2>推荐课程</h2>
          <RouterLink to="/courses">查看全部</RouterLink>
        </div>
        <CourseCard v-for="course in courseStore.recommended" :key="course.id" :course="course" @book="bookCourse" />
      </div>

      <div class="section-band">
        <div class="section-title">
          <h2>即将开始</h2>
          <RouterLink to="/bookings">管理预约</RouterLink>
        </div>
        <div v-if="bookingStore.upcoming.length" class="list-stack">
          <article v-for="booking in bookingStore.upcoming" :key="booking.id" class="booking-row">
            <div>
              <h3>{{ booking.course?.title }}</h3>
              <p>{{ formatDateTime(booking.scheduleTime) }}</p>
            </div>
            <BookingStatusBadge :status="booking.status" />
          </article>
        </div>
        <EmptyState v-else title="暂无预约" description="从课程广场选择一个合适的训练时间" />
      </div>
    </section>

    <section class="panel">
      <div class="section-title">
        <h2>体测趋势</h2>
        <span>{{ latestMetric?.advice }}</span>
      </div>
      <MetricTrendChart :metrics="metricStore.list" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ElMessage } from 'element-plus'
import BookingStatusBadge from '@/components/common/BookingStatusBadge.vue'
import CourseCard from '@/components/common/CourseCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import MetricTrendChart from '@/components/common/MetricTrendChart.vue'
import { useBookingStats } from '@/hooks/useBookingStats'
import { useBookingStore } from '@/stores/bookingStore'
import { useBodyMetricStore } from '@/stores/bodyMetricStore'
import { useCourseStore } from '@/stores/courseStore'
import { formatDateTime } from '@/utils/dateFormat'
import type { Course } from '@/types/domain'

const courseStore = useCourseStore()
const bookingStore = useBookingStore()
const metricStore = useBodyMetricStore()
const { stats } = useBookingStats()

const latestMetric = computed(() => metricStore.list[metricStore.list.length - 1])

async function bookCourse(course: Course, scheduleTime: string) {
  await bookingStore.create(course.id, scheduleTime)
  ElMessage.success(`已预约 ${course.title}`)
}

onMounted(async () => {
  await Promise.all([courseStore.loadRecommended(), bookingStore.loadBookings(), metricStore.loadMetrics()])
})
</script>
