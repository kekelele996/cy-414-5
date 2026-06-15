<template>
  <article class="course-card">
    <div class="course-head">
      <div>
        <span v-if="course.reason" class="reason">{{ course.reason }}</span>
        <h3>{{ course.title }}</h3>
      </div>
      <span class="price">{{ formatPrice(course.price) }}</span>
    </div>

    <p>{{ course.description }}</p>

    <div class="meta-grid">
      <span><Timer :size="16" />{{ course.duration }} 分钟</span>
      <span><Users :size="16" />{{ course.maxCapacity }} 人</span>
      <span><CalendarClock :size="16" />{{ nextSchedule }}</span>
    </div>

    <div class="course-foot">
      <CoachAvatar :coach="course.coach" />
      <el-dropdown v-if="course.schedule.length" trigger="click" @command="handleBook">
        <el-button type="primary" :icon="CalendarPlus">预约</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="slot in course.schedule" :key="slot" :command="slot">
              {{ formatSchedule(slot) }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { CalendarClock, CalendarPlus, Timer, Users } from '@lucide/vue'
import type { Course } from '@/types/domain'
import CoachAvatar from './CoachAvatar.vue'
import { formatPrice, formatSchedule } from '@/utils/formatters'
import { useCoachSchedule } from '@/hooks/useCoachSchedule'

const props = defineProps<{
  course: Course
}>()

const emit = defineEmits<{
  book: [course: Course, scheduleTime: string]
}>()

const courseRef = computed(() => toRef(props, 'course').value)
const { nextSchedule } = useCoachSchedule(courseRef)

function handleBook(value: string | number | object) {
  emit('book', props.course, String(value))
}
</script>

<style scoped>
.course-card {
  display: grid;
  gap: 16px;
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.course-head,
.course-foot {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
}

h3 {
  margin: 4px 0 0;
  color: var(--ink);
  font-size: 20px;
  line-height: 1.25;
}

p {
  min-height: 44px;
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.reason {
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
}

.price {
  flex: 0 0 auto;
  color: var(--green);
  font-size: 24px;
  font-weight: 900;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.meta-grid span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: var(--muted);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 680px) {
  .course-head,
  .course-foot {
    align-items: stretch;
    flex-direction: column;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
