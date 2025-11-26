import { defineStore } from 'pinia'
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types/user'
import * as usersApi from '@/http/users'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    loading: false as boolean,
    actionLoading: { create: false as boolean, update: false as boolean, remove: false as boolean },
    errors: { load: null as string | null, create: null as string | null, update: null as string | null, remove: null as string | null },
  }),
  actions: {
    async load() {
      this.loading = true
      this.errors.load = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          this.users = await usersApi.listUsers()
        } else {
          const raw = localStorage.getItem('users')
          this.users = raw ? JSON.parse(raw) : []
        }
      } catch (err: any) {
        this.errors.load = err?.message ?? String(err)
      } finally {
        this.loading = false
      }
    },
    async create(payload: CreateUserPayload) {
      this.actionLoading.create = true
      this.errors.create = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          const u = await usersApi.createUser(payload)
          this.users.unshift(u)
          return u
        }
        const u: User = { id: Date.now().toString(), ...payload, active: true, createdAt: new Date().toISOString() }
        this.users.unshift(u)
        localStorage.setItem('users', JSON.stringify(this.users))
        return u
      } catch (err: any) {
        this.errors.create = err?.message ?? String(err)
        throw err
      } finally {
        this.actionLoading.create = false
      }
    },
    async update(id: string, payload: UpdateUserPayload) {
      this.actionLoading.update = true
      this.errors.update = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          const u = await usersApi.updateUser(id, payload)
          this.users = this.users.map(x => x.id === id ? u : x)
          return u
        }
        this.users = this.users.map(x => x.id === id ? { ...x, ...payload } : x)
        localStorage.setItem('users', JSON.stringify(this.users))
        return this.users.find(x => x.id === id)
      } catch (err: any) {
        this.errors.update = err?.message ?? String(err)
        throw err
      } finally {
        this.actionLoading.update = false
      }
    },
    async remove(id: string) {
      this.actionLoading.remove = true
      this.errors.remove = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          await usersApi.deleteUser(id)
          this.users = this.users.filter(x => x.id !== id)
          return
        }
        this.users = this.users.filter(x => x.id !== id)
        localStorage.setItem('users', JSON.stringify(this.users))
      } catch (err: any) {
        this.errors.remove = err?.message ?? String(err)
        throw err
      } finally {
        this.actionLoading.remove = false
      }
    }
  }
})
