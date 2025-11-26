import { defineStore } from 'pinia'
import type { FileMeta } from '@/types/file'
import * as filesApi from '@/http/files'

export const useFilesStore = defineStore('files', {
  state: () => ({
    files: [] as FileMeta[],
    // loading for list/load
    loading: false as boolean,
  // per-action loading flags. `remove` holds the uploadedAt of the file being removed (or null)
  actionLoading: { add: false as boolean, remove: null as string | null },
    // per-action error messages
    errors: { load: null as string | null, add: null as string | null, remove: null as string | null },
  }),
  actions: {
    async load() {
      this.loading = true
      this.errors.load = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          this.files = await filesApi.listFiles()
        } else {
          const raw = localStorage.getItem('uploadedFiles')
          this.files = raw ? JSON.parse(raw) : []
        }
      } catch (err: any) {
        this.errors.load = err?.message ?? String(err)
      } finally {
        this.loading = false
      }
    },
    async add(file: FileMeta) {
      this.actionLoading.add = true
      this.errors.add = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          const created = await filesApi.uploadFile(file)
          this.files.unshift(created)
          return created
        }
        const f = { ...file, uploadedAt: file.uploadedAt || new Date().toISOString() }
        this.files.unshift(f)
        localStorage.setItem('uploadedFiles', JSON.stringify(this.files))
        return f
      } catch (err: any) {
        this.errors.add = err?.message ?? String(err)
        throw err
      } finally {
        this.actionLoading.add = false
      }
    },
    async remove(uploadedAt: string) {
  this.actionLoading.remove = uploadedAt
  this.errors.remove = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          // assume server returns id or uses uploadedAt as identifier
          await filesApi.deleteFile(uploadedAt)
          this.files = this.files.filter(f => f.uploadedAt !== uploadedAt)
          return
        }
        this.files = this.files.filter(f => f.uploadedAt !== uploadedAt)
        localStorage.setItem('uploadedFiles', JSON.stringify(this.files))
      } catch (err: any) {
        this.errors.remove = err?.message ?? String(err)
        throw err
      } finally {
        this.actionLoading.remove = null
      }
    }
  }
})
