import { api } from './index'
import type { FileMeta } from '@/types/file'

export async function listFiles(): Promise<FileMeta[]> {
  if (!api.defaults.baseURL) return []
  const res = await api.get('/files')
  return res.data
}

export async function uploadFile(payload: Partial<FileMeta>): Promise<FileMeta> {
  const res = await api.post('/files', payload)
  return res.data
}

export async function deleteFile(id: string): Promise<void> {
  await api.delete(`/files/${id}`)
}
