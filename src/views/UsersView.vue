<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { User, CreateUserPayload, UpdateUserPayload } from '@/types/user'
import { useUsersStore } from '@/store/users'
import ConfirmModal from '@/components/ConfirmModal.vue'

const { t } = useI18n()

// State via store
const usersStore = useUsersStore()
onMounted(() => { usersStore.load() })

// expose store errors for template
const storeErrors = usersStore.errors
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedUser = ref<User | null>(null)
const searchTerm = ref('')

// confirm modal state for users
const confirmVisible = ref(false)
const confirmTarget = ref<string | null>(null)

// Form state
const newUser = ref<CreateUserPayload>({
  username: '',
  fullName: '',
  email: '',
  role: 'agent',
  password: ''
})

// show/hide password in create modal
const showCreatePassword = ref(false)
function toggleShowCreatePassword() {
  showCreatePassword.value = !showCreatePassword.value
}

// edit modal password state
const editPassword = ref('')
const showEditPassword = ref(false)
function toggleShowEditPassword() {
  showEditPassword.value = !showEditPassword.value
}

// Computed
const filteredUsers = computed(() => {
  const term = searchTerm.value.toLowerCase()
  return usersStore.users.filter((user: User) =>
    user.username.toLowerCase().includes(term) ||
    user.fullName.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
  )
})

// Actions
// Actions using store
async function createUser() {
  const payload = { ...newUser.value }
  await usersStore.create(payload)
  showCreateModal.value = false
  newUser.value = {
    username: '',
    fullName: '',
    email: '',
    role: 'agent',
    password: ''
  }
}

async function updateUser(id: string, payload: UpdateUserPayload) {
  // include editPassword if provided
  const finalPayload = { ...(payload as any) }
  if (editPassword.value) finalPayload.password = editPassword.value
  await usersStore.update(id, finalPayload)
  showEditModal.value = false
  selectedUser.value = null
  editPassword.value = ''
  showEditPassword.value = false
}

function deleteUser(id: string) {
  // show modal instead of window.confirm
  confirmTarget.value = id
  confirmVisible.value = true
}

function openEditModal(user: User) {
  selectedUser.value = { ...user }
  showEditModal.value = true
}

async function onConfirmDeleteUser() {
  if (!confirmTarget.value) return closeConfirmUser()
  try {
    await usersStore.remove(confirmTarget.value)
  } finally {
    closeConfirmUser()
  }
}

function closeConfirmUser() {
  confirmTarget.value = null
  confirmVisible.value = false
}

</script>

<template>
  <div class="users-view">
    <!-- Header with search and create -->
    <div class="users-header">
      <div class="left">
        <h2>{{ t('users.title') }}</h2>
        <div class="search">
          <i class="fa-solid fa-search"></i>
          <input 
            type="search" 
            v-model="searchTerm"
            :placeholder="t('users.searchPlaceholder')"
          />
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <div v-if="storeErrors.load" class="error">{{ storeErrors.load }}</div>
        <button class="btn primary" @click="showCreateModal = true" :disabled="usersStore.actionLoading.create">
        <i class="fa-solid fa-plus"></i>
        {{ t('users.create') }}
        </button>
      </div>
    </div>

    <!-- Users table -->
    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>{{ t('users.table.name') }}</th>
            <th>{{ t('users.table.username') }}</th>
            <th>{{ t('users.table.email') }}</th>
            <th>{{ t('users.table.role') }}</th>
            <th>{{ t('users.table.status') }}</th>
            <th>{{ t('users.table.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.fullName }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge" :class="user.role">
                {{ t(`users.roles.${user.role}`) }}
              </span>
            </td>
            <td>
              <span class="badge" :class="user.active ? 'active' : 'inactive'">
                {{ t(`users.status.${user.active ? 'active' : 'inactive'}`) }}
              </span>
            </td>
            <td>
              <button class="btn icon" @click="openEditModal(user)" :title="t('users.edit')" :disabled="usersStore.actionLoading.update">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn icon danger" @click="deleteUser(user.id)" :title="t('users.delete')" :disabled="usersStore.actionLoading.remove">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <h3>{{ t('users.createModal.title') }}</h3>
        
        <div class="form-group">
          <label>{{ t('users.form.username') }}</label>
          <input type="text" v-model="newUser.username" />
        </div>
        
        <div class="form-group">
          <label>{{ t('users.form.fullName') }}</label>
          <input type="text" v-model="newUser.fullName" />
        </div>
        
        <div class="form-group">
          <label>{{ t('users.form.email') }}</label>
          <input type="email" v-model="newUser.email" />
        </div>
        
        <div class="form-group">
          <label>{{ t('users.form.role') }}</label>
          <select v-model="newUser.role">
            <option value="admin">{{ t('users.roles.admin') }}</option>
            <option value="agent">{{ t('users.roles.agent') }}</option>
          </select>
        </div>
        
        <div class="form-group input-password">
          <label>{{ t('users.form.password') }}</label>
          <input :type="showCreatePassword ? 'text' : 'password'" v-model="newUser.password" />
          <button
            type="button"
            class="password-toggle"
            @click="toggleShowCreatePassword"
            :aria-label="showCreatePassword ? t('users.form.hidePassword') : t('users.form.showPassword')"
            title="{{ showCreatePassword ? t('users.form.hidePassword') : t('users.form.showPassword') }}"
          >
            <i :class="showCreatePassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>

        <div class="modal-actions">
          <button class="btn" @click="showCreateModal = false">
            {{ t('common.cancel') }}
          </button>
          <div style="display:flex;flex-direction:column;align-items:flex-end">
            <div v-if="usersStore.errors.create" class="error">{{ usersStore.errors.create }}</div>
            <button class="btn primary" @click="createUser" :disabled="usersStore.actionLoading.create">
              <span v-if="usersStore.actionLoading.create">{{ t('common.loading') || 'Creating...' }}</span>
              <span v-else>{{ t('users.create') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal && selectedUser" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal">
        <h3>{{ t('users.editModal.title', { user: selectedUser.username }) }}</h3>
        
        <div class="form-group">
          <label>{{ t('users.form.fullName') }}</label>
          <input type="text" v-model="selectedUser.fullName" />
        </div>
        
        <div class="form-group">
          <label>{{ t('users.form.email') }}</label>
          <input type="email" v-model="selectedUser.email" />
        </div>
        
        <div class="form-group">
          <label>{{ t('users.form.role') }}</label>
          <select v-model="selectedUser.role">
            <option value="admin">{{ t('users.roles.admin') }}</option>
            <option value="agent">{{ t('users.roles.agent') }}</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>{{ t('users.form.status') }}</label>
          <select v-model="selectedUser.active">
            <option :value="true">{{ t('users.status.active') }}</option>
            <option :value="false">{{ t('users.status.inactive') }}</option>
          </select>
        </div>
        
        <div class="form-group input-password">
          <label>{{ t('users.form.newPassword') }}</label>
          <input :type="showEditPassword ? 'text' : 'password'" v-model="editPassword" placeholder="********" />
          <button
            type="button"
            class="password-toggle"
            @click="toggleShowEditPassword"
            :aria-label="showEditPassword ? t('users.form.hidePassword') : t('users.form.showPassword')"
          >
            <i :class="showEditPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
          <small>{{ t('users.form.passwordHint') }}</small>
        </div>

        <div class="modal-actions">
          <div style="display:flex;flex-direction:column;align-items:flex-end">
            <div v-if="usersStore.errors.update" class="error">{{ usersStore.errors.update }}</div>
            <button class="btn" @click="showEditModal = false">
              {{ t('common.cancel') }}
            </button>
            <button 
              class="btn primary" 
              @click="updateUser(selectedUser.id, selectedUser)"
              :disabled="usersStore.actionLoading.update"
            >
              <span v-if="usersStore.actionLoading.update">{{ t('common.loading') || 'Saving...' }}</span>
              <span v-else>{{ t('users.save') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ConfirmModal
    :show="confirmVisible"
    :title="t('users.delete')"
    :message="t('users.confirmDelete')"
    :confirmText="t('users.delete')"
    :cancelText="t('common.cancel')"
    @update:show="val => confirmVisible = val"
    @confirm="onConfirmDeleteUser"
  />
</template>

<style scoped>
.users-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.users-header .left {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.search {
  position: relative;
  width: 300px;
}

.search input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--color-text-primary);
}

.search i {
  position: absolute;
  left: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
}

.table-container {
  flex: 1;
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: var(--bg-tertiary);
  padding: var(--spacing-md) var(--spacing-lg);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  position: sticky;
  top: 0;
}

.users-table td {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.badge.admin {
  background: var(--color-error-bg);
  color: var(--color-error-text);
}

.badge.agent {
  background: var(--color-info-bg);
  color: var(--color-info-text);
}

.badge.active {
  background: var(--color-success-bg);
  color: var(--color-success-text);
}

.badge.inactive {
  background: var(--bg-quaternary);
  color: var(--color-text-light);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.btn.primary {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  color: var(--color-white);
}

.btn.icon {
  padding: 0.4rem;
}

.btn.danger {
  color: var(--color-error);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: var(--bg-primary);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--color-text-primary);
}

.input-password {
  position: relative;
}

.input-password input {
  padding-right: 2.6rem;
}

.password-toggle {
  position: absolute;
  right: 0.6rem;
  top: 75%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
}

.password-toggle:focus {
  outline: 2px solid var(--color-primary-light);
  border-radius: var(--radius-sm);
}

.form-group small {
  display: block;
  margin-top: var(--spacing-xs);
  color: var(--color-text-tertiary);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}
</style>