<template>
  <el-tag :type="BookingStatusTone[status]" effect="plain" round class="status-badge">
    {{ formatBookingStatus(status) }}
  </el-tag>
</template>

<script setup lang="ts">
import { BookingStatusTone, type BookingStatusValue } from '@/constants/booking'
import { formatBookingStatus } from '@/utils/formatters'

defineProps<{
  status: BookingStatusValue
}>()
</script>

<style scoped>
.status-badge {
  min-width: 68px;
  justify-content: center;
  font-weight: 700;
}
</style>

