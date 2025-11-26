<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCustomPromptsStore } from '@/store/customPrompts'
import useToast from '@/composables/useToast'

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
.prompts-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.prompts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-lg);
}

.prompts-header h3 {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.prompts-body {
  display: flex;
  justify-content: center;
  width: 100%;
  flex: 1;
}

.prompts-textarea {
  width: 100%;
  min-height: 420px;
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  resize: vertical;
  font-family: inherit;
  background-color: var(--bg-primary);
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
}

.prompts-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--spacing-lg);
}

.btn {
  padding: var(--spacing-sm) 0.8rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
}

.btn.small {
  padding: 0.3rem 0.6rem;
}

.btn.primary {
  background: var(--color-primary-dark);
  color: var(--color-white);
  border-color: transparent;
}
</style>
