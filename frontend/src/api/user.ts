import { request } from '@/utils/request'
import type { AuthPayload, User } from '@/types/domain'

export const userApi = {
  register(payload: { phone: string; password: string; nickname: string; role: string }) {
    return request.post<unknown, AuthPayload>('/auth/register', payload)
  },
  login(payload: { phone: string; password: string }) {
    return request.post<unknown, AuthPayload>('/auth/login', payload)
  },
  me() {
    return request.get<unknown, User>('/users/me')
  },
  updateMe(payload: Partial<User>) {
    return request.put<unknown, User>('/users/me', payload)
  },
  coaches() {
    return request.get<unknown, User[]>('/users/coaches')
  }
}

