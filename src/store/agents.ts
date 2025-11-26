import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Agent, CreateAgentPayload, UpdateAgentPayload } from '@/types/agent'
import * as agentsApi from '@/http/agents'

export const useAgentsStore = defineStore('agents', () => {
  const agents = ref<Agent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAgents() {
    loading.value = true
    error.value = null
    try {
      agents.value = await agentsApi.getAgents()
    } catch (e: any) {
      error.value = e?.message || 'Error fetching agents'
    } finally {
      loading.value = false
    }
  }

  async function createAgent(payload: CreateAgentPayload) {
    const created = await agentsApi.createAgent(payload)
    agents.value.push(created)
    return created
  }

  async function updateAgent(id: number, payload: UpdateAgentPayload) {
    const updated = await agentsApi.updateAgent(id, payload)
    const idx = agents.value.findIndex(a => a.id === id)
    if (idx !== -1) agents.value[idx] = updated
    return updated
  }

  async function deleteAgent(id: number) {
    await agentsApi.deleteAgent(id)
    agents.value = agents.value.filter(a => a.id !== id)
  }

  return { agents, loading, error, fetchAgents, createAgent, updateAgent, deleteAgent }
})

