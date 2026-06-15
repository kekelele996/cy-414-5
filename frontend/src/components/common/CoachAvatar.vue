<template>
  <div class="coach-avatar">
    <el-avatar :src="coach?.avatar || undefined" :size="size">
      {{ initials }}
    </el-avatar>
    <div v-if="showName" class="coach-copy">
      <strong>{{ coach?.nickname || '未分配教练' }}</strong>
      <span>{{ coach?.role ? formatRole(coach.role) : '教练' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/types/domain'
import { formatRole } from '@/utils/formatters'

const props = withDefaults(
  defineProps<{
    coach?: Pick<User, 'nickname' | 'avatar' | 'role'>
    size?: number
    showName?: boolean
  }>(),
  {
    size: 38,
    showName: true
  }
)

const initials = computed(() => props.coach?.nickname?.slice(0, 2) || 'FP')
</script>

<style scoped>
.coach-avatar {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.coach-copy {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.coach-copy strong,
.coach-copy span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coach-copy span {
  color: var(--muted);
  font-size: 12px;
}
</style>
