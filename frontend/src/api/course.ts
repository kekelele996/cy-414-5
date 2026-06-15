import { request } from '@/utils/request'
import type { Course } from '@/types/domain'

export const courseApi = {
  list(params?: { keyword?: string; coachId?: number }) {
    return request.get<unknown, Course[]>('/courses', { params })
  },
  recommended() {
    return request.get<unknown, Course[]>('/courses/recommended')
  },
  detail(id: number) {
    return request.get<unknown, Course>(`/courses/${id}`)
  },
  create(payload: Partial<Course>) {
    return request.post<unknown, Course>('/courses', payload)
  }
}

