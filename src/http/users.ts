import { api } from './index'
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types/user'

export async function listUsers(): Promise<User[]> {
  if (!api.defaults.baseURL) return []
  const res = await api.get('/users')
  return res.data
}

export async function getUser(id: string): Promise<User> {
  const res = await api.get(`/users/${id}`)
  return res.data
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const res = await api.post('/users', payload)
  return res.data
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const res = await api.put(`/users/${id}`, payload)
  return res.data
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`)
}
