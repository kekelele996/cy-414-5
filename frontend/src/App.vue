<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">FP</div>
        <div>
          <strong>FitPro</strong>
          <span>私教预约平台</span>
        </div>
      </div>

      <nav>
        <RouterLink v-for="item in navItems" :key="item.path" :to="item.path">
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="main">
      <header class="topbar">
        <div>
          <span class="eyebrow">训练预约工作台</span>
          <h1>{{ routeTitle }}</h1>
        </div>
        <div class="user-pill">
          <el-avatar :src="auth.user?.avatar || undefined" :size="36">{{ auth.user?.nickname?.slice(0, 2) }}</el-avatar>
          <div>
            <strong>{{ auth.user?.nickname }}</strong>
            <span>{{ formatRole(auth.role) }}</span>
          </div>
        </div>
      </header>

      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Activity, CalendarCheck, ChartSpline, Dumbbell, UserRound } from '@lucide/vue'
import { useAuthStore } from '@/stores/authStore'
import { formatRole } from '@/utils/formatters'

const auth = useAuthStore()
const route = useRoute()

const navItems = [
  { path: '/dashboard', label: '首页', icon: Activity },
  { path: '/courses', label: '课程广场', icon: Dumbbell },
  { path: '/bookings', label: '我的预约', icon: CalendarCheck },
  { path: '/body-metrics', label: '体测记录', icon: ChartSpline },
  { path: '/profile', label: '个人中心', icon: UserRound }
]

const routeTitle = computed(() => navItems.find(item => item.path === route.path)?.label || '首页')

onMounted(() => auth.bootstrap())
</script>
