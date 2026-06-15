<template>
  <div class="empty-state">
    <Dumbbell :size="28" />
    <strong>{{ title }}</strong>
    <span>{{ description }}</span>
  </div>
</template>

<script setup lang="ts">
import { Dumbbell } from '@lucide/vue'

defineProps<{
  title: string
  description: string
}>()
</script>

<style scoped>
.empty-state {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 38px 16px;
  color: var(--muted);
  border: 1px dashed var(--line);
  border-radius: 8px;
  background: var(--surface-soft);
  text-align: center;
}

.empty-state strong {
  color: var(--ink);
}
</style>
