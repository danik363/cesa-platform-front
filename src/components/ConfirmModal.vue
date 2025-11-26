<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  show: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}>()

const emit = defineEmits(['update:show', 'confirm', 'cancel'])

function close() {
  emit('update:show', false)
  emit('cancel')
}

function confirm() {
  emit('update:show', false)
  emit('confirm')
}
</script>

<template>
  <div v-if="props.show" class="confirm-overlay" @click.self="close">
    <div class="confirm-modal">
      <h4 class="confirm-title">{{ props.title ?? 'Confirm' }}</h4>
      <div class="confirm-body">{{ props.message ?? '' }}</div>
      <div class="confirm-actions">
        <button class="btn" @click="close">{{ props.cancelText ?? 'Cancel' }}</button>
        <button class="btn primary" @click="confirm">{{ props.confirmText ?? 'Confirm' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.confirm-modal {
  background: var(--bg-primary);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--radius-lg);
  max-width: 420px;
  width: 100%;
  box-shadow: var(--shadow-lg);
}

.confirm-title {
  margin: 0 0 var(--spacing-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.confirm-body {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
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
</style>
