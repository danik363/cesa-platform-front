import { api } from './index'

export interface Organization {
  id: string
  name: string
  createdAt?: string
}

export async function listOrganizations(): Promise<Organization[]> {
  if (!api.defaults.baseURL) return []
  const res = await api.get('/organizations')
  return res.data
}

export async function createOrganization(payload: Partial<Organization>): Promise<Organization> {
  const res = await api.post('/organizations', payload)
  return res.data
}

export async function updateOrganization(id: string, payload: Partial<Organization>): Promise<Organization> {
  const res = await api.put(`/organizations/${id}`, payload)
  return res.data
}

export async function deleteOrganization(id: string): Promise<void> {
  await api.delete(`/organizations/${id}`)
}
