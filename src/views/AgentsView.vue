<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAgentsStore } from '@/store/agents'
import { useAuthStore } from '@/store/auth'
import ConfirmModal from '@/components/ConfirmModal.vue'
import useToast from '@/composables/useToast'

const { t } = useI18n()
const router = useRouter()
const agentsStore = useAgentsStore()
const authStore = useAuthStore()
const { push: pushToast } = useToast()

const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

const confirmVisible = ref(false)
const confirmTarget = ref<number | null>(null)

onMounted(() => {
  agentsStore.fetchAgents()
})

const agents = computed(() => agentsStore.agents)

function goToEdit(agentId: number) {
  router.push(`/organizations/agents/${agentId}`)
}

function goToCreate() {
  router.push('/organizations/agents/-1')
}

function openConfirm(id: number) {
  confirmTarget.value = id
  confirmVisible.value = true
}

function closeConfirm() {
  confirmTarget.value = null
  confirmVisible.value = false
}

async function onConfirmDelete() {
  if (confirmTarget.value === null) return closeConfirm()
  try {
    await agentsStore.deleteAgent(confirmTarget.value)
    pushToast(t('agents.deleted'), 'success')
  } catch (err: any) {
    pushToast(err?.message || t('common.error'), 'error')
  } finally {
    closeConfirm()
  }
}

function getTypeBadgeClass(type: string) {
  return type === 'ELEVEN_LABS' ? 'badge eleven-labs' : 'badge n8n'
}

function getTypeLabel(type: string) {
  return type === 'ELEVEN_LABS' ? 'Eleven Labs' : 'N8N'
}
</script>

<template>
  <div class="agents-view">
    <div class="header">
      <h2>{{ t('agents.title') }}</h2>
      <button v-if="isAdmin" class="btn primary" @click="goToCreate">{{ t('agents.create') }}</button>
    </div>

    <div class="table-container">
      <table class="agents-table">
        <thead>
          <tr>
            <th>{{ t('agents.table.name') }}</th>
            <th>{{ t('agents.table.type') }}</th>
            <th v-if="isAdmin">{{ t('agents.table.organization') }}</th>
            <th>{{ t('agents.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="agent in agents" :key="agent.id">
            <td>{{ agent.name }}</td>
            <td><span :class="getTypeBadgeClass(agent.type)">{{ getTypeLabel(agent.type) }}</span></td>
            <td v-if="isAdmin">{{ agent.organizationName || '-' }}</td>
            <td>
              <button class="btn icon" @click="goToEdit(agent.id)"><i class="fa-solid fa-pen"></i></button>
              <button v-if="isAdmin" class="btn icon danger" @click="openConfirm(agent.id)"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmModal
      :show="confirmVisible"
      :title="t('agents.delete')"
      :message="t('agents.confirmDelete')"
      :confirmText="t('agents.delete')"
      :cancelText="t('common.cancel')"
      @update:show="val => confirmVisible = val"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<style scoped>
.agents-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.table-container {
  flex: 1;
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.agents-table {
  width: 100%;
  border-collapse: collapse;
}

.agents-table th,
.agents-table td {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  text-align: left;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.badge.n8n {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
}

.badge.eleven-labs {
  background: #e0f2fe;
  color: #0369a1;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.btn.primary {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.btn.icon {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
}

.btn.icon.danger {
  color: var(--color-error);
}
</style>

