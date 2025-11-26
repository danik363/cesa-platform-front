import { defineStore } from 'pinia'
import type { CustomPrompt } from '@/http/customPrompts'
import * as promptsApi from '@/http/customPrompts'

export const useCustomPromptsStore = defineStore('customPrompts', {
  state: () => ({
    prompts: [] as CustomPrompt[],
    loading: false as boolean,
    actionLoading: { save: false as boolean, remove: false as boolean },
    errors: { load: null as string | null, save: null as string | null, remove: null as string | null },
  }),
  actions: {
    async load() {
      this.loading = true
      this.errors.load = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          this.prompts = await promptsApi.listPrompts()
        } else {
          const raw = localStorage.getItem('customPrompts')
          this.prompts = raw ? JSON.parse(raw) : []
        }
      } catch (err: any) {
        this.errors.load = err?.message ?? String(err)
      } finally {
        this.loading = false
      }
    },
    async save(p: CustomPrompt) {
      this.actionLoading.save = true
      this.errors.save = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          const res = await promptsApi.savePrompt(p)
          const idx = this.prompts.findIndex(x => x.id === (res as any).id)
          if (idx >= 0) this.prompts.splice(idx, 1, res)
          else this.prompts.unshift(res)
          return res
        }
        const item = { ...p, id: p.id || Date.now().toString(), updatedAt: new Date().toISOString() }
        const idx = this.prompts.findIndex(x => x.id === item.id)
        if (idx >= 0) this.prompts.splice(idx, 1, item)
        else this.prompts.unshift(item)
        localStorage.setItem('customPrompts', JSON.stringify(this.prompts))
        return item
      } catch (err: any) {
        this.errors.save = err?.message ?? String(err)
        throw err
      } finally {
        this.actionLoading.save = false
      }
    },
    async remove(id: string) {
      this.actionLoading.remove = true
      this.errors.remove = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          await promptsApi.deletePrompt(id)
          this.prompts = this.prompts.filter(x => x.id !== id)
          return
        }
        this.prompts = this.prompts.filter(x => x.id !== id)
        localStorage.setItem('customPrompts', JSON.stringify(this.prompts))
      } catch (err: any) {
        this.errors.remove = err?.message ?? String(err)
        throw err
      } finally {
        this.actionLoading.remove = false
      }
    }
  }
})
