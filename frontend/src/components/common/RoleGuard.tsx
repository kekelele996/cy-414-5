import { defineComponent } from 'vue'
import { useAuth } from '@/hooks/useAuth'
import type { UserRoleValue } from '@/constants/user'

export default defineComponent({
  name: 'RoleGuard',
  props: {
    roles: {
      type: Array as () => UserRoleValue[],
      required: true
    }
  },
  setup(props, { slots }) {
    const { can } = useAuth()
    return () => (can(props.roles) ? slots.default?.() : null)
  }
})

