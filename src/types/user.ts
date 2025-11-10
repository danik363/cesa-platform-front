export type UserRole = 'admin' | 'agent'

export interface User {
  id: string
  username: string
  fullName: string
  email: string
  role: UserRole
  active: boolean
  createdAt: string
}

export interface CreateUserPayload {
  username: string
  fullName: string
  email: string
  role: UserRole
  password: string
}

export interface UpdateUserPayload {
  fullName?: string
  email?: string
  role?: UserRole
  active?: boolean
  password?: string
}