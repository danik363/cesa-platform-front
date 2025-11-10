import { api } from './index'

export interface CustomPrompt {
  id?: string
  content: string
  updatedAt?: string
}

export async function listPrompts(): Promise<CustomPrompt[]> {
  if (!api.defaults.baseURL) return []
  const res = await api.get('/custom-prompts')
  return res.data
}

export async function savePrompt(payload: CustomPrompt): Promise<CustomPrompt> {
  if (payload.id) {
    const res = await api.put(`/custom-prompts/${payload.id}`, payload)
    return res.data
  }
  const res = await api.post('/custom-prompts', payload)
  return res.data
}

export async function deletePrompt(id: string): Promise<void> {
  await api.delete(`/custom-prompts/${id}`)
}
