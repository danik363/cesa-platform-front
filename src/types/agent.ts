export type AgentType = 'PROMPT_SHEET' | 'ELEVEN_LABS'

export interface Agent {
  id: number
  name: string
  type: AgentType
  prompt: string
  organizationId: number
  organizationName?: string
  // ELEVEN_LABS specific
  test?: string
}

export interface CreateAgentPayload {
  name: string
  type: AgentType
  prompt: string
  organizationId: number
  test?: string
}

export interface UpdateAgentPayload {
  name?: string
  prompt?: string
  organizationId?: number
  test?: string
}

