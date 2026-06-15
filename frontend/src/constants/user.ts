export const UserRole = {
  STUDENT: 'student',
  COACH: 'coach',
  ADMIN: 'admin'
} as const

export type UserRoleValue = (typeof UserRole)[keyof typeof UserRole]

export const UserRoleLabel: Record<UserRoleValue, string> = {
  [UserRole.STUDENT]: '学员',
  [UserRole.COACH]: '教练',
  [UserRole.ADMIN]: '管理员'
}

export const UserRoleHomeRoute: Record<UserRoleValue, string> = {
  [UserRole.STUDENT]: '/dashboard',
  [UserRole.COACH]: '/dashboard',
  [UserRole.ADMIN]: '/dashboard'
}

