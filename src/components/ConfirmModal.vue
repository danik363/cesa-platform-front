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
.confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:60}
.confirm-modal{background:white;padding:1rem 1.25rem;border-radius:8px;max-width:420px;width:100%;box-shadow:0 12px 40px rgba(0,0,0,0.12)}
.confirm-title{margin:0 0 0.5rem}
.confirm-body{color:#374151;margin-bottom:1rem}
.confirm-actions{display:flex;justify-content:flex-end;gap:0.5rem}
.btn{padding:0.5rem 0.8rem;border-radius:6px;border:1px solid #cfd8e3;background:#fff;cursor:pointer}
.btn.primary{background:#4f46e5;color:#fff;border-color:transparent}
</style>
