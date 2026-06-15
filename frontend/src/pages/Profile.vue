<template>
  <div class="section-band">
    <section class="panel profile-panel">
      <AvatarUploader v-model="form.avatar" :nickname="form.nickname" />

      <el-form label-position="top" class="profile-form">
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" disabled />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" disabled>
            <el-option v-for="(label, value) in UserRoleLabel" :key="value" :label="label" :value="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="form.gender" />
        </el-form-item>
        <el-form-item label="身高 cm">
          <el-input-number v-model="form.height" :min="120" :max="230" />
        </el-form-item>
        <el-form-item label="体重 kg">
          <el-input-number v-model="form.weight" :min="30" :max="200" :step="0.1" />
        </el-form-item>
      </el-form>

      <div class="toolbar">
        <el-button type="primary" :icon="Save" @click="save">保存资料</el-button>
        <el-button :icon="LogIn" @click="auth.login()">演示登录</el-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from 'vue'
import { ElMessage } from 'element-plus'
import { LogIn, Save } from '@lucide/vue'
import AvatarUploader from '@/components/common/AvatarUploader.vue'
import { UserRoleLabel } from '@/constants/user'
import { useAuthStore } from '@/stores/authStore'
import { userApi } from '@/api/user'

const auth = useAuthStore()
const form = reactive({
  nickname: '',
  phone: '',
  avatar: '',
  role: auth.role,
  gender: '',
  height: 168,
  weight: 58
})

watchEffect(() => {
  if (!auth.user) return
  form.nickname = auth.user.nickname
  form.phone = auth.user.phone
  form.avatar = auth.user.avatar || ''
  form.role = auth.user.role
  form.gender = auth.user.gender || ''
  form.height = auth.user.height || 168
  form.weight = auth.user.weight || 58
})

async function save() {
  try {
    auth.user = await userApi.updateMe(form)
  } catch {
    if (auth.user) {
      auth.user = { ...auth.user, ...form }
    }
  }
  ElMessage.success('个人资料已保存')
}
</script>

<style scoped>
.profile-panel {
  display: grid;
  gap: 24px;
  max-width: 900px;
}

.profile-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

@media (max-width: 620px) {
  .profile-form {
    grid-template-columns: 1fr;
  }
}
</style>
