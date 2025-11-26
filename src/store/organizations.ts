import { defineStore } from 'pinia'
import type { Organization } from '@/http/organizations'
import * as orgApi from '@/http/organizations'

export const useOrganizationsStore = defineStore('organizations', {
  state: () => ({
    organizations: [] as Organization[],
    loading: false as boolean,
    actionLoading: { create: false as boolean, update: false as boolean, remove: null as string | null },
    errors: { load: null as string | null, create: null as string | null, update: null as string | null, remove: null as string | null },
  }),
  actions: {
    async load() {
      this.loading = true
      this.errors.load = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          this.organizations = await orgApi.listOrganizations()
        } else {
          const raw = localStorage.getItem('organizations')
          this.organizations = raw ? JSON.parse(raw) : []
        }
      } catch (err: any) {
        this.errors.load = String(err?.message ?? err)
      } finally {
        this.loading = false
      }
    },

    async create(payload: Partial<Organization>) {
      this.actionLoading.create = true
      this.errors.create = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          const created = await orgApi.createOrganization(payload)
          this.organizations.unshift(created)
        } else {
          const created: Organization = { id: String(Date.now()), name: payload.name || '', createdAt: new Date().toISOString() }
          this.organizations.unshift(created)
          localStorage.setItem('organizations', JSON.stringify(this.organizations))
        }
      } catch (err: any) {
        this.errors.create = String(err?.message ?? err)
        throw err
      } finally {
        this.actionLoading.create = false
      }
    },

    async update(id: string, payload: Partial<Organization>) {
      this.actionLoading.update = false
      this.errors.update = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          const updated = await orgApi.updateOrganization(id, payload)
          const idx = this.organizations.findIndex(o => o.id === id)
          if (idx !== -1) this.organizations[idx] = updated
        } else {
          const idx = this.organizations.findIndex(o => o.id === id)
          if (idx !== -1) {
            this.organizations[idx] = { ...this.organizations[idx], ...(payload as Organization) }
            localStorage.setItem('organizations', JSON.stringify(this.organizations))
          }
        }
      } catch (err: any) {
        this.errors.update = String(err?.message ?? err)
        throw err
      } finally {
        this.actionLoading.update = false
      }
    },

    async remove(id: string) {
      this.actionLoading.remove = id
      this.errors.remove = null
      try {
        if (Boolean(import.meta.env.VITE_API_CESA_PLATFORM)) {
          await orgApi.deleteOrganization(id)
          this.organizations = this.organizations.filter(o => o.id !== id)
        } else {
          this.organizations = this.organizations.filter(o => o.id !== id)
          localStorage.setItem('organizations', JSON.stringify(this.organizations))
        }
      } catch (err: any) {
        this.errors.remove = String(err?.message ?? err)
        throw err
      } finally {
        this.actionLoading.remove = null
      }
    }
  }
})
