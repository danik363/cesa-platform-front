<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOrganizationsStore } from '@/store/organizations'
import type { Organization } from '@/http/organizations'
import ConfirmModal from '@/components/ConfirmModal.vue'
import useToast from '@/composables/useToast'

const { t } = useI18n()
const orgStore = useOrganizationsStore()
const { push: pushToast } = useToast()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedOrg = ref<Organization | null>(null)
const newOrgName = ref('')

const confirmVisible = ref(false)
const confirmTarget = ref<string | null>(null)

onMounted(() => { orgStore.load() })

const filteredOrgs = computed(() => orgStore.organizations)

function openEdit(org: Organization) {
  selectedOrg.value = { ...org }
  showEditModal.value = true
}

function openConfirm(id: string) {
  confirmTarget.value = id
  confirmVisible.value = true
}

function closeConfirm() {
  confirmTarget.value = null
  confirmVisible.value = false
}

async function createOrg() {
  if (!newOrgName.value.trim()) return pushToast(t('organizations.nameRequired'), 'error')
  try {
    await orgStore.create({ name: newOrgName.value.trim() })
    pushToast(t('organizations.created'), 'success')
    newOrgName.value = ''
    showCreateModal.value = false
  } catch (err: any) {
    pushToast(String(orgStore.errors.create ?? err?.message ?? t('common.error')), 'error')
  }
}

async function saveEdit() {
  if (!selectedOrg.value) return
  try {
    await orgStore.update(selectedOrg.value.id, { name: selectedOrg.value.name })
    pushToast(t('organizations.updated'), 'success')
    showEditModal.value = false
    selectedOrg.value = null
  } catch (err: any) {
    pushToast(String(orgStore.errors.update ?? err?.message ?? t('common.error')), 'error')
  }
}

async function onConfirmDelete() {
  if (!confirmTarget.value) return closeConfirm()
  try {
    await orgStore.remove(confirmTarget.value)
    pushToast(t('organizations.deleted'), 'success')
  } catch (err: any) {
    pushToast(String(orgStore.errors.remove ?? err?.message ?? t('common.error')), 'error')
  } finally {
    closeConfirm()
  }
}
</script>

<template>
  <div class="organizations-view">
    <div class="header">
      <h2>{{ t('organizations.title') }}</h2>
      <div>
        <button class="btn primary" @click="showCreateModal = true">{{ t('organizations.create') }}</button>
      </div>
    </div>

    <div class="table-container">
      <table class="org-table">
        <thead>
          <tr>
            <th>{{ t('organizations.table.name') }}</th>
            <th>{{ t('organizations.table.createdAt') }}</th>
            <th>{{ t('organizations.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in filteredOrgs" :key="o.id">
            <td>{{ o.name }}</td>
            <td>{{ o.createdAt ? new Date(o.createdAt).toLocaleString() : '-' }}</td>
            <td>
              <button class="btn icon" @click="openEdit(o)"><i class="fa-solid fa-pen"></i></button>
              <button class="btn icon danger" @click="openConfirm(o.id)"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <h3>{{ t('organizations.createModal.title') }}</h3>
        <div class="form-group">
          <label>{{ t('organizations.form.name') }}</label>
          <input type="text" v-model="newOrgName" />
        </div>
        <div class="modal-actions">
          <button class="btn" @click="showCreateModal = false">{{ t('common.cancel') }}</button>
          <button class="btn primary" @click="createOrg" :disabled="orgStore.actionLoading.create">{{ t('organizations.create') }}</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal && selectedOrg" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal">
        <h3>{{ t('organizations.editModal.title', { name: selectedOrg.name }) }}</h3>
        <div class="form-group">
          <label>{{ t('organizations.form.name') }}</label>
          <input type="text" v-model="selectedOrg.name" />
        </div>
        <div class="modal-actions">
          <button class="btn" @click="showEditModal = false">{{ t('common.cancel') }}</button>
          <button class="btn primary" @click="saveEdit" :disabled="orgStore.actionLoading.update">{{ t('common.save') }}</button>
        </div>
      </div>
    </div>

    <ConfirmModal
      :show="confirmVisible"
      :title="t('organizations.delete')"
      :message="t('organizations.confirmDelete')"
      :confirmText="t('organizations.delete')"
      :cancelText="t('common.cancel')"
      @update:show="val => confirmVisible = val"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<style scoped>
.organizations-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom: var(--spacing-xl);
}

.table-container {
  flex: 1;
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.org-table {
  width: 100%;
  border-collapse: collapse;
}

.org-table th, .org-table td {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.form-group input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.modal { max-width: 480px }

</style>
