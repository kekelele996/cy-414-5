import { createRouter, createWebHistory } from 'vue-router'
import { UserRole } from '@/constants/user'
import Dashboard from '@/pages/Dashboard.vue'
import Courses from '@/pages/Courses.vue'
import Bookings from '@/pages/Bookings.vue'
import BodyMetrics from '@/pages/BodyMetrics.vue'
import Profile from '@/pages/Profile.vue'
import { installGuards } from './guards'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard, meta: { roles: [UserRole.STUDENT, UserRole.COACH, UserRole.ADMIN] } },
    { path: '/courses', component: Courses, meta: { roles: [UserRole.STUDENT, UserRole.COACH, UserRole.ADMIN] } },
    { path: '/bookings', component: Bookings, meta: { roles: [UserRole.STUDENT, UserRole.COACH, UserRole.ADMIN] } },
    { path: '/body-metrics', component: BodyMetrics, meta: { roles: [UserRole.STUDENT, UserRole.ADMIN] } },
    { path: '/profile', component: Profile, meta: { roles: [UserRole.STUDENT, UserRole.COACH, UserRole.ADMIN] } }
  ]
})

installGuards(router)

