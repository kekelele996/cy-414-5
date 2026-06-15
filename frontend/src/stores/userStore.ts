import { defineStore } from 'pinia'
import { userApi } from '@/api/user'
import { UserRole } from '@/constants/user'
import type { User } from '@/types/domain'

export const useUserStore = defineStore('users', {
  state: () => ({
    coaches: [
      {
        id: 2,
        phone: '13800000002',
        nickname: 'Coach Han',
        avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=160&h=160&fit=crop',
        role: UserRole.COACH
      }
    ] as User[]
  }),
  actions: {
    async loadCoaches() {
      try {
        this.coaches = await userApi.coaches()
      } catch {
        // Keep demo coaches for offline UI verification.
      }
    }
  }
})

