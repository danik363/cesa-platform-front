<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFilesStore } from '@/store/files'
import type { FileMeta } from '@/types/file'
import ConfirmModal from '@/components/ConfirmModal.vue'
import useToast from '@/composables/useToast'

const { t } = useI18n()
const filesStore = useFilesStore()

const showModal = ref(false)
const selectedFile = ref<File | null>(null)
const { push: pushToast } = useToast()
// confirm modal state
const confirmVisible = ref(false)
const confirmTarget = ref<string | null>(null)

function openConfirm(uploadedAt: string) {
  confirmTarget.value = uploadedAt
  confirmVisible.value = true
}

function closeConfirm() {
  confirmTarget.value = null
  confirmVisible.value = false
}

onMounted(() => {
  filesStore.load()
})

function openModal() {
  selectedFile.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  selectedFile.value = input.files?.[0] ?? null
}

async function upload() {
  if (!selectedFile.value) return alert(t('files.uploadModal.chooseFile'))
  const f = selectedFile.value
  const reader = new FileReader()
  reader.onload = async () => {
    const content = reader.result as string
    const meta: FileMeta = { name: f.name, size: f.size, uploadedAt: new Date().toISOString(), content }
    try {
      await filesStore.add(meta)
      pushToast(t('files.uploaded'), 'success')
    } catch (err: any) {
      pushToast(String(filesStore.errors.add ?? err?.message ?? t('files.uploadError')), 'error')
    } finally {
      closeModal()
    }
  }
  reader.readAsDataURL(f)
}

function downloadFile(fileMeta: FileMeta) {
  if (!fileMeta.content) return
  const link = document.createElement('a')
  link.href = fileMeta.content
  link.download = fileMeta.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function deleteFile(uploadedAt: string) {
  // open modal instead of window.confirm
  openConfirm(uploadedAt)
}

async function onConfirmDelete() {
  if (!confirmTarget.value) return closeConfirm()
  try {
    await filesStore.remove(confirmTarget.value)
    pushToast(t('files.deleted'), 'success')
  } finally {
    closeConfirm()
  }
}
</script>

<template>
  <div class="files-shell">
    <div class="files-header">
      <h3>{{ t('files.title') }}</h3>
    </div>

    <div class="files-list" role="list">
      <div v-if="filesStore.errors.load" class="error">{{ filesStore.errors.load }}</div>
      <div v-if="filesStore.files.length === 0" class="empty">{{ t('files.noFiles') }}</div>

      <div v-else class="grid">
        <div v-for="f in filesStore.files" :key="f.uploadedAt" class="file-item" role="listitem">
          <div v-if="filesStore.actionLoading.remove === f.uploadedAt" class="card-spinner" aria-hidden>
            <span class="spinner small"></span>
          </div>
          <div class="file-icon" aria-hidden>📄</div>
          <div class="file-body">
            <div class="file-name" :title="f.name">{{ f.name }}</div>
            <div class="file-meta">{{ (f.size/1024).toFixed(1) }} KB · {{ new Date(f.uploadedAt).toLocaleString() }}</div>
            <div class="file-actions">
              <button class="btn-action download" @click="downloadFile(f)" :title="t('files.download')">
                <i class="fa-solid fa-download"></i>{{ t('files.download') }}
              </button>
              <button class="btn-action delete" @click="deleteFile(f.uploadedAt)" :title="t('files.delete')" :disabled="filesStore.actionLoading.remove === f.uploadedAt">
                <i class="fa-solid fa-trash"></i>{{ t('files.delete') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Floating upload button -->
  <button class="fab" @click="openModal" aria-label="Upload" :disabled="filesStore.actionLoading.add">+
  </button>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h4>{{ t('files.uploadModal.title') }}</h4>
        <input type="file" @change="onFileChange" />
        <div v-if="filesStore.errors.add" class="error">{{ filesStore.errors.add }}</div>
        <div class="modal-actions">
          <button class="btn" @click="closeModal">{{ t('files.uploadModal.cancel') }}</button>
          <button class="btn primary" @click="upload" :disabled="filesStore.actionLoading.add">
            <span v-if="filesStore.actionLoading.add"><span class="spinner"></span></span>
            <span v-else>{{ t('files.uploadModal.uploadButton') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <ConfirmModal
    :show="confirmVisible"
    :title="t('files.delete')"
    :message="t('files.confirmDelete')"
    :confirmText="t('files.delete')"
    :cancelText="t('common.cancel')"
    @update:show="val => confirmVisible = val"
    @confirm="onConfirmDelete"
  />
</template>

<style scoped>
.files-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.files-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
}

.files-list {
  flex: 1;
  overflow: auto;
  padding: var(--spacing-md);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.file-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  border: 1px solid var(--color-border-subtle);
  box-shadow: var(--shadow-md);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  min-width: 270px;
}

.file-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.file-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, var(--color-primary-light), #eef6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.file-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.file-name {
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text-primary);
}

.file-meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin-top: 6px;
}

.file-actions {
  display: flex;
  gap: 6px;
  margin-top: var(--spacing-md);
}

.btn-action {
  padding: 6px 10px;
  font-size: var(--font-size-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.12s ease;
}

.btn-action:hover {
  background: var(--bg-quaternary);
  border-color: var(--color-text-tertiary);
}

.btn-action.delete:hover {
  background: var(--color-error-bg);
  border-color: var(--color-error);
}

.empty {
  padding: var(--spacing-lg);
  color: var(--color-text-tertiary);
  text-align: center;
}

.fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-full);
  background: var(--color-primary-dark);
  color: var(--color-white);
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
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
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  max-width: 420px;
  width: 100%;
  box-shadow: var(--shadow-lg);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.btn {
  padding: var(--spacing-sm) 0.8rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
}

.btn.primary {
  background: var(--color-primary-dark);
  color: var(--color-white);
  border-color: transparent;
}

.loading-inline {
  font-size: 0.9rem;
  color: var(--color-text-tertiary);
  margin-left: 6px;
}

.error {
  color: var(--color-error);
  background: var(--color-error-bg);
  border: 1px solid var(--color-error);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  margin: var(--spacing-sm) 0;
  font-size: var(--font-size-sm);
}

.spinner {
  display: inline-block;
  border: 3px solid rgba(255, 255, 255, 0.18);
  border-left-color: var(--color-white);
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 0.9s linear infinite;
  vertical-align: middle;
}

.spinner.small {
  width: 14px;
  height: 14px;
  border-width: 2px;
  border-left-color: var(--color-primary);
}

.card-spinner {
  position: absolute;
  right: 10px;
  top: 10px;
}

.file-item {
  position: relative;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
