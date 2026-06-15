<template>
  <div class="section-band">
    <section class="panel">
      <div class="toolbar">
        <el-input v-model="courseStore.keyword" clearable placeholder="搜索课程、教练或训练目标" :prefix-icon="Search" @keyup.enter="courseStore.loadCourses" />
        <el-select v-model="courseStore.coachId" clearable placeholder="教练筛选" style="width: 220px" @change="courseStore.loadCourses">
          <el-option v-for="coach in userStore.coaches" :key="coach.id" :label="coach.nickname" :value="coach.id" />
        </el-select>
        <el-button type="primary" :icon="SlidersHorizontal" @click="courseStore.loadCourses">筛选</el-button>
        <RoleGuard :roles="[UserRole.COACH, UserRole.ADMIN]">
          <el-button :icon="Plus">发布课程</el-button>
        </RoleGuard>
      </div>
    </section>

    <section v-if="courseStore.list.length" class="grid-2">
      <CourseCard v-for="course in courseStore.list" :key="course.id" :course="course" @book="bookCourse" />
    </section>
    <EmptyState v-else title="没有匹配课程" description="换一个训练目标或教练再筛选" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Search, SlidersHorizontal } from '@lucide/vue'
import CourseCard from '@/components/common/CourseCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import RoleGuard from '@/components/common/RoleGuard'
import { UserRole } from '@/constants/user'
import { useBookingStore } from '@/stores/bookingStore'
import { useCourseStore } from '@/stores/courseStore'
import { useUserStore } from '@/stores/userStore'
import type { Course } from '@/types/domain'

const courseStore = useCourseStore()
const bookingStore = useBookingStore()
const userStore = useUserStore()

async function bookCourse(course: Course, scheduleTime: string) {
  await bookingStore.create(course.id, scheduleTime)
  ElMessage.success(`预约已提交：${course.title}`)
}

onMounted(async () => {
  await Promise.all([courseStore.loadCourses(), userStore.loadCoaches()])
})
</script>
