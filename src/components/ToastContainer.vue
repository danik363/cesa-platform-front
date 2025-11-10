<script setup lang="ts">
import { computed } from 'vue'
import useToast from '../composables/useToast'

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
.toast-root{position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:100}
.toast-container{display:flex;flex-direction:column;gap:8px;align-items:center}
.toast{min-width:220px;max-width:520px;padding:0.6rem 0.75rem;border-radius:8px;color:white;display:flex;justify-content:space-between;align-items:center;box-shadow:0 12px 40px rgba(2,6,23,0.12)}
.toast.success{background:#16a34a}
.toast.error{background:#dc2626}
.toast.info{background:#0ea5e9}
.toast-message{flex:1;padding-right:8px}
.toast-close{background:transparent;border:none;color:rgba(255,255,255,0.95);cursor:pointer}

/* slide + fade animation */
.toast-slide-enter-from{opacity:0;transform:translateY(-10px)}
.toast-slide-enter-active{transition:all .28s cubic-bezier(.2,.8,.2,1)}
.toast-slide-enter-to{opacity:1;transform:translateY(0)}
.toast-slide-leave-from{opacity:1;transform:translateY(0)}
.toast-slide-leave-active{transition:all .22s cubic-bezier(.2,.8,.2,1)}
.toast-slide-leave-to{opacity:0;transform:translateY(-8px)}

</style>
