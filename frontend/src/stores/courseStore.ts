import { defineStore } from 'pinia'
import { courseApi } from '@/api/course'
import { UserRole } from '@/constants/user'
import type { Course } from '@/types/domain'

const demoCourses: Course[] = [
  {
    id: 1,
    coachId: 2,
    title: '晨间力量唤醒',
    description: '小班力量训练，聚焦核心激活与动作模式校准。',
    duration: 60,
    price: 188,
    maxCapacity: 6,
    schedule: ['2026-06-16T08:00:00+08:00', '2026-06-18T08:00:00+08:00'],
    status: 'published',
    reason: '最近可约',
    coach: {
      id: 2,
      nickname: 'Coach Han',
      avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=160&h=160&fit=crop',
      role: UserRole.COACH
    }
  },
  {
    id: 2,
    coachId: 2,
    title: '体态矫正私教',
    description: '肩颈、髋膝踝评估后定制动作方案。',
    duration: 45,
    price: 260,
    maxCapacity: 1,
    schedule: ['2026-06-16T19:00:00+08:00', '2026-06-19T19:30:00+08:00'],
    status: 'published',
    reason: '训练匹配',
    coach: {
      id: 2,
      nickname: 'Coach Han',
      avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=160&h=160&fit=crop',
      role: UserRole.COACH
    }
  },
  {
    id: 3,
    coachId: 4,
    title: '心肺燃脂循环',
    description: '器械与自重结合，适合需要提升耐力的学员。',
    duration: 50,
    price: 168,
    maxCapacity: 8,
    schedule: ['2026-06-17T12:30:00+08:00'],
    status: 'published',
    coach: {
      id: 4,
      nickname: 'Mia',
      avatar: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=160&h=160&fit=crop',
      role: UserRole.COACH
    }
  }
]

export const useCourseStore = defineStore('courses', {
  state: () => ({
    list: demoCourses,
    recommended: demoCourses.slice(0, 2),
    keyword: '',
    coachId: undefined as number | undefined
  }),
  actions: {
    async loadCourses() {
      try {
        this.list = await courseApi.list({ keyword: this.keyword || undefined, coachId: this.coachId })
      } catch {
        this.list = demoCourses.filter(course => !this.keyword || course.title.includes(this.keyword) || course.description?.includes(this.keyword))
      }
    },
    async loadRecommended() {
      try {
        this.recommended = await courseApi.recommended()
      } catch {
        this.recommended = demoCourses.slice(0, 2)
      }
    }
  }
})

