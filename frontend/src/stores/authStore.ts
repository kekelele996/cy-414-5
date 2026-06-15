import { defineStore } from 'pinia'
import { UserRole, type UserRoleValue } from '@/constants/user'
import { userApi } from '@/api/user'
import type { User } from '@/types/domain'

const demoUser: User = {
  id: 1,
  phone: '13800000001',
  nickname: '林佳',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop',
  role: UserRole.STUDENT,
  gender: 'female',
  height: 168,
  weight: 58
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('fitpro_token') || '',
    user: JSON.parse(localStorage.getItem('fitpro_user') || 'null') as User | null,
    bootstrapped: false
  }),
  getters: {
    isAuthed: state => Boolean(state.token),
    role: state => state.user?.role || UserRole.STUDENT,
    isCoach: state => state.user?.role === UserRole.COACH,
    isAdmin: state => state.user?.role === UserRole.ADMIN
  },
  actions: {
    async bootstrap() {
      if (this.bootstrapped) return
      try {
        if (this.token) {
          this.user = await userApi.me()
        } else {
          const data = await userApi.login({ phone: '13800000001', password: 'fitpro123' })
          this.token = data.token
          this.user = data.user
          localStorage.setItem('fitpro_token', data.token)
          localStorage.setItem('fitpro_user', JSON.stringify(data.user))
        }
      } catch {
        this.user = demoUser
        this.token = ''
        localStorage.removeItem('fitpro_token')
      } finally {
        if (!this.user) this.user = demoUser
        this.bootstrapped = true
      }
    },
    async login(phone = '13800000001', password = 'fitpro123') {
      try {
        const data = await userApi.login({ phone, password })
        this.token = data.token
        this.user = data.user
      } catch {
        this.token = ''
        this.user = demoUser
      }
      if (this.token) {
        localStorage.setItem('fitpro_token', this.token)
      } else {
        localStorage.removeItem('fitpro_token')
      }
      localStorage.setItem('fitpro_user', JSON.stringify(this.user))
    },
    hasRole(roles: UserRoleValue[]) {
      return roles.includes(this.role)
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('fitpro_token')
      localStorage.removeItem('fitpro_user')
    }
  }
})
