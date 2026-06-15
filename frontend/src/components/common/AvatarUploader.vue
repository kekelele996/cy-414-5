<template>
  <div class="avatar-uploader">
    <el-avatar :src="modelValue || undefined" :size="88">{{ fallback }}</el-avatar>
    <div class="upload-actions">
      <el-input v-model="draft" placeholder="头像 URL" clearable />
      <el-button :icon="Upload" @click="emit('update:modelValue', draft)">更新头像</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Upload } from '@lucide/vue'

const props = defineProps<{
  modelValue?: string | null
  nickname?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const draft = ref(props.modelValue || '')
const fallback = computed(() => props.nickname?.slice(0, 2) || 'FP')

watch(
  () => props.modelValue,
  value => {
    draft.value = value || ''
  }
)
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  align-items: center;
  gap: 18px;
}

.upload-actions {
  display: grid;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

@media (max-width: 560px) {
  .avatar-uploader {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
