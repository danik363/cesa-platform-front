import api from './index'
import type { Agent, CreateAgentPayload, UpdateAgentPayload } from '@/types/agent'

// Mock data for development
const mockAgents: Agent[] = [
  { id: 1, name: 'Agente Ventas', type: 'PROMPT_SHEET', prompt: 'Eres un asistente de ventas especializado...', organizationId: 1, organizationName: 'Cesa Corp' },
  { id: 2, name: 'Soporte Técnico', type: 'PROMPT_SHEET', prompt: 'Eres un agente de soporte técnico...', organizationId: 1, organizationName: 'Cesa Corp' },
  { id: 3, name: 'Asistente Voz', type: 'ELEVEN_LABS', prompt: 'Eres un asistente de voz amigable...', organizationId: 2, organizationName: 'Tech Solutions', test: 'valor de prueba' },
  { id: 4, name: 'Recepcionista Virtual', type: 'ELEVEN_LABS', prompt: 'Eres una recepcionista virtual profesional...', organizationId: 2, organizationName: 'Tech Solutions', test: '' },
  { id: 5, name: 'Agente Marketing', type: 'PROMPT_SHEET', prompt: 'Eres un experto en marketing digital...', organizationId: 1, organizationName: 'Cesa Corp' }
]

export async function getAgents(): Promise<Agent[]> {
  // Mock implementation for development
  return Promise.resolve([...mockAgents])
  // Real implementation:
  // const resp = await api.get('/agents')
  // return resp.data
}

export async function getAgent(id: number): Promise<Agent> {
  const resp = await api.get(`/agents/${id}`)
  return resp.data
}

export async function createAgent(payload: CreateAgentPayload): Promise<Agent> {
  const resp = await api.post('/agents', payload)
  return resp.data
}

export async function updateAgent(id: number, payload: UpdateAgentPayload): Promise<Agent> {
  const resp = await api.patch(`/agents/${id}`, payload)
  return resp.data
}

export async function deleteAgent(id: number): Promise<void> {
  await api.delete(`/agents/${id}`)
}

