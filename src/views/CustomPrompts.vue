<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCustomPromptsStore } from '../store/customPrompts'
import useToast from '../composables/useToast'

const { t } = useI18n()
const promptsStore = useCustomPromptsStore()
const { push: pushToast } = useToast()

const content = ref('')
let currentId: string | undefined = undefined

onMounted(async () => {
  await promptsStore.load()
  const first = promptsStore.prompts[0]
  if (first) {
    content.value = first.content
    currentId = first.id
  }
})

// errors will be used directly from promptsStore in template when needed

async function save() {
  const payload = { id: currentId, content: content.value }
  try {
    const res = await promptsStore.save(payload as any)
    currentId = (res as any).id
    pushToast(t('customPrompts.saved'), 'success')
  } catch (err: any) {
    const msg = promptsStore.errors.save ?? err?.message ?? 'Error'
    pushToast(String(msg), 'error')
  }
}

async function pullChanges() {
  try {
    await promptsStore.load()
    const first = promptsStore.prompts[0]
    content.value = first?.content ?? ''
    currentId = first?.id
    pushToast(t('customPrompts.pulled'), 'success')
  } catch (err: any) {
    pushToast(String(promptsStore.errors.load ?? err?.message ?? 'Error'), 'error')
  }
}
</script>

<template>
  <div class="prompts-shell">
    <div class="prompts-header">
      <h3>{{ t('customPrompts.title') }}</h3>
      <button class="btn small" @click="pullChanges">{{ t('customPrompts.pull') }}</button>
    </div>

    <div class="prompts-body">
      <textarea v-model="content" class="prompts-textarea" placeholder="{{ t('customPrompts.placeholder') }}"></textarea>
    </div>

    <div class="prompts-footer">
      <button class="btn primary" @click="save">{{ t('customPrompts.save') }}</button>
    </div>
  </div>
  </template>

<style scoped>
.prompts-shell{display:flex;flex-direction:column;height:100%}
.prompts-header{display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0}
.prompts-body{display: flex; justify-content: center; width: 100%;}
.prompts-textarea{width:100%;min-height:420px;padding:1rem;border:1px solid #e6edf3;border-radius:8px;resize:vertical;font-family:inherit}
.prompts-footer{display:flex;justify-content:flex-end;padding-top:0.8rem}
.btn{padding:0.5rem 0.8rem;border-radius:6px;border:1px solid #cfd8e3;background:#fff;cursor:pointer}
.btn.small{padding:0.3rem 0.6rem}
.btn.primary{background:#4f46e5;color:#fff;border-color:transparent}
</style>
