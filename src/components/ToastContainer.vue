<script setup lang="ts">
import { computed } from 'vue'
import useToast from '@/composables/useToast'

const { toasts, remove } = useToast()
const list = computed(() => toasts.value)
</script>

<template>
  <div class="toast-root" aria-live="polite">
    <transition-group name="toast-slide" tag="div" class="toast-container">
      <div v-for="t in list" :key="t.id" :class="['toast', t.type]">
        <div class="toast-message">{{ t.message }}</div>
        <button class="toast-close" @click="remove(t.id)">✕</button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-root {
  position: fixed;
  left: 50%;
  top: 18px;
  transform: translateX(-50%);
  z-index: var(--z-modal);
}

.toast-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
}

.toast {
  min-width: 220px;
  max-width: 520px;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  color: var(--color-white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-lg);
}

.toast.success {
  background: var(--color-success);
}

.toast.error {
  background: var(--color-error);
}

.toast.info {
  background: var(--color-info);
}

.toast-message {
  flex: 1;
  padding-right: 8px;
}

.toast-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  font-weight: var(--font-weight-bold);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.toast-slide-enter-active {
  transition: all 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.toast-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.toast-slide-leave-active {
  transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
