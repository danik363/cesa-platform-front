<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFilesStore } from '../store/files'
import type { FileMeta } from '../types/file'
import ConfirmModal from '../components/ConfirmModal.vue'
import useToast from '../composables/useToast'

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
      <div class="meta">
        {{ filesStore.files.length }}
        <span v-if="filesStore.loading" class="loading-inline"> · {{ t('common.loading') || 'Loading...' }}</span>
      </div>
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
.files-shell{display:flex;flex-direction:column;height:100%}
.files-header{display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0}
.files-list{flex:1;overflow:auto;padding:0.6rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.file-item{display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:10px;background:#fff;border:1px solid rgba(16,24,40,0.04);box-shadow:0 6px 18px rgba(16,24,40,0.04);transition:transform .12s ease,box-shadow .12s ease}
.file-item:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(16,24,40,0.08)}
.file-icon{width:44px;height:44px;border-radius:8px;background:linear-gradient(180deg,#eef2ff,#eef6ff);display:flex;align-items:center;justify-content:center;font-size:1.2rem}
.file-body{display:flex;flex-direction:column;min-width:0}
.file-name{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.file-meta{font-size:0.85rem;color:#6b7280;margin-top:6px}
.file-actions{display:flex;gap:6px;margin-top:10px}
.btn-action{padding:6px 10px;font-size:0.8rem;border-radius:6px;border:1px solid #cfd8e3;background:#fff;cursor:pointer;transition:all .12s ease}
.btn-action:hover{background:#f3f4f6;border-color:#9ca3af}
.btn-action.delete:hover{background:#fee2e2;border-color:#fca5a5}
.empty{padding:1rem;color:#6b7280;text-align:center}
.fab{position:fixed;right:24px;bottom:24px;width:52px;height:52px;border-radius:50%;background:#4f46e5;color:white;border:none;font-size:1.6rem;cursor:pointer;box-shadow:0 6px 18px rgba(79,70,229,0.18);display:flex;justify-content:center;align-items:center;outline:none}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center}
.modal{background:white;padding:1rem;border-radius:8px;max-width:420px;width:100%;box-shadow:0 8px 28px rgba(0,0,0,0.12)}
.modal-actions{display:flex;justify-content:flex-end;gap:0.6rem;margin-top:1rem}
.btn{padding:0.5rem 0.8rem;border-radius:6px;border:1px solid #cfd8e3;background:#fff;cursor:pointer}
.btn.primary{background:#4f46e5;color:#fff;border-color:transparent}
.loading-inline{font-size:0.9rem;color:#6b7280;margin-left:6px}
.error{color:#b91c1c;background:#fff5f5;border:1px solid #fecaca;padding:0.5rem 0.75rem;border-radius:6px;margin:0.5rem 0}
.spinner{display:inline-block;border:3px solid rgba(255,255,255,0.18);border-left-color:#fff;border-radius:50%;width:18px;height:18px;animation:spin .9s linear infinite;vertical-align:middle}
.spinner.small{width:14px;height:14px;border-width:2px;border-left-color:#4f46e5}
.card-spinner{position:absolute;right:10px;top:10px}
.file-item{position:relative}
@keyframes spin{to{transform:rotate(360deg)}}
</style>
