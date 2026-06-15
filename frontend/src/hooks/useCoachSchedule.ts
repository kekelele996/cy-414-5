import { computed, type Ref } from 'vue'
import type { Course } from '@/types/domain'
import { formatSchedule } from '@/utils/formatters'

export function useCoachSchedule(course: Ref<Course | undefined>) {
  const scheduleOptions = computed(() => (course.value?.schedule || []).map(item => ({ label: formatSchedule(item), value: item })))
  const nextSchedule = computed(() => scheduleOptions.value[0]?.label || '待排期')
  return { scheduleOptions, nextSchedule }
}

