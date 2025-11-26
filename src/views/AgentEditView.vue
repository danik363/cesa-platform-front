<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAgentsStore } from '@/store/agents'
import { useAuthStore } from '@/store/auth'
import { useOrganizationsStore } from '@/store/organizations'
import type { Agent, AgentType } from '@/types/agent'
import useToast from '@/composables/useToast'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const agentsStore = useAgentsStore()
const authStore = useAuthStore()
const orgStore = useOrganizationsStore()
const { push: pushToast } = useToast()

const isAdmin = computed(() => authStore.user?.role === 'ADMIN')
const agentId = computed(() => Number(route.params.id))
const isNewAgent = computed(() => agentId.value === -1)

const agent = ref<Agent | null>(null)
const loading = ref(true)

onMounted(async () => {
  if (isAdmin.value) {
    await orgStore.load()
  }
  
  if (isNewAgent.value) {
    // New agent - initialize with defaults
    agent.value = {
      id: -1,
      name: '',
      type: 'PROMPT_SHEET',
      prompt: '',
      organizationId: orgStore.organizations[0]?.id ? Number(orgStore.organizations[0].id) : 1
    }
  } else {
    await agentsStore.fetchAgents()
    const found = agentsStore.agents.find(a => a.id === agentId.value)
    if (found) {
      agent.value = { ...found }
    }
  }
  loading.value = false
})

async function save() {
  if (!agent.value) return
  
  // Validation for new agent
  if (isNewAgent.value && !agent.value.name.trim()) {
    pushToast(t('agents.nameRequired'), 'error')
    return
  }
  
  try {
    if (isNewAgent.value) {
      // Create new agent
      const payload = {
        name: agent.value.name,
        type: agent.value.type,
        prompt: agent.value.prompt,
        organizationId: agent.value.organizationId,
        ...(agent.value.type === 'ELEVEN_LABS' ? { test: agent.value.test } : {})
      }
      await agentsStore.createAgent(payload)
      pushToast(t('agents.created'), 'success')
    } else {
      // Update existing agent
      const payload: any = { prompt: agent.value.prompt }
      if (isAdmin.value) {
        payload.organizationId = agent.value.organizationId
      }
      if (agent.value.type === 'ELEVEN_LABS') {
        payload.test = agent.value.test
      }
      await agentsStore.updateAgent(agent.value.id, payload)
      pushToast(t('agents.updated'), 'success')
    }
    router.push('/organizations/agents')
  } catch (err: any) {
    pushToast(err?.message || t('common.error'), 'error')
  }
}

function cancel() {
  router.push('/organizations/agents')
}

function getTypeLabel(type: string) {
  return type === 'ELEVEN_LABS' ? 'Eleven Labs' : 'N8N'
}
</script>

<template>
  <div class="agent-edit-view">
    <div class="header">
      <button class="btn back" @click="cancel">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <h2>{{ isNewAgent ? t('agents.createModal.title') : t('agents.editModal.title', { name: agent?.name || '' }) }}</h2>
    </div>

    <div v-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i>
    </div>

    <div v-else-if="!agent" class="not-found">
      {{ t('agents.notFound') }}
    </div>

    <form v-else class="agent-form" @submit.prevent="save">
      <!-- Name -->
      <div class="form-group">
        <label>{{ t('agents.form.name') }}</label>
        <input type="text" v-model="agent.name" :disabled="!isNewAgent" />
      </div>

      <!-- Type -->
      <div class="form-group">
        <label>{{ t('agents.form.type') }}</label>
        <select v-if="isNewAgent" v-model="agent.type">
          <option value="PROMPT_SHEET">N8N</option>
          <option value="ELEVEN_LABS">Eleven Labs</option>
        </select>
        <input v-else type="text" :value="getTypeLabel(agent.type)" disabled />
      </div>

      <!-- Organization (admin only) -->
      <div v-if="isAdmin" class="form-group">
        <label>{{ t('agents.form.organization') }}</label>
        <select v-model="agent.organizationId">
          <option v-for="org in orgStore.organizations" :key="org.id" :value="Number(org.id)">{{ org.name }}</option>
        </select>
      </div>

      <!-- Prompt (editable for all) -->
      <div class="form-group">
        <label>{{ t('agents.form.prompt') }}</label>
        <textarea v-model="agent.prompt" rows="10"></textarea>
      </div>

      <!-- ELEVEN_LABS specific: test field -->
      <template v-if="agent.type === 'ELEVEN_LABS'">
        <div class="form-group">
          <label>{{ t('agents.form.test') }}</label>
          <input type="text" v-model="agent.test" />
        </div>
      </template>

      <div class="form-actions">
        <button type="button" class="btn" @click="cancel">{{ t('common.cancel') }}</button>
        <button type="submit" class="btn primary">{{ t('common.save') }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.agent-edit-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 720px;
}

.header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.header h2 {
  margin: 0;
}

.btn.back {
  display: flex;
  align-items: center;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  cursor: pointer;
}

.loading,
.not-found {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
}

.agent-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  background: var(--bg-primary);
  color: var(--color-text-primary);
}

.form-group input:disabled {
  background: var(--bg-secondary);
  color: var(--color-text-tertiary);
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.btn.primary {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}
</style>

