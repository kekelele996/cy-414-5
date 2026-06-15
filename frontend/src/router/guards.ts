import type { Router } from 'vue-router'
import { UserRole, UserRoleHomeRoute } from '@/constants/user'
import { useAuthStore } from '@/stores/authStore'

export function installGuards(router: Router) {
  router.beforeEach(async to => {
    const auth = useAuthStore()
    await auth.bootstrap()
    const roles = to.meta.roles as string[] | undefined
    if (roles?.length && !roles.includes(auth.role)) {
      return UserRoleHomeRoute[auth.role] || UserRoleHomeRoute[UserRole.STUDENT]
    }
    return true
  })
}

