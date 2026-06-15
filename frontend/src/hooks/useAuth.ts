import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import type { UserRoleValue } from '@/constants/user'

export function useAuth() {
  const auth = useAuthStore()
  const user = computed(() => auth.user)
  const role = computed(() => auth.role)
  const can = (roles: UserRoleValue[]) => auth.hasRole(roles)
  return { auth, user, role, can }
}

