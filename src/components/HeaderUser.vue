<template>
  <div class="header-user">
    <button class="user-btn" @click="toggleMenu" @keydown.enter.prevent="toggleMenu" aria-haspopup="true" :aria-expanded="showMenu">
      <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" class="avatar" />
      <div v-else class="avatar avatar--fallback">{{ initials }}</div>
      <span class="username">{{ username }}</span>
      <svg class="chev" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M7 10l5 5 5-5z"/>
      </svg>
    </button>

    <transition name="fade">
      <div v-if="showMenu" class="menu" role="menu">
        <button class="menu-item" @click="onConfigure" role="menuitem">{{ t('headerUser.configure') }}</button>
        <button class="menu-item" @click="onLogout" role="menuitem">{{ t('headerUser.logout') }}</button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'


const { t } = useI18n()
const props = defineProps<{ username?: string; avatarUrl?: string }>()
const emit = defineEmits<{
  (e: 'configure'): void
  (e: 'logout'): void
}>()

const showMenu = ref(false)
const username = computed(() => props.username ?? 'Usuario')
const avatarUrl = computed(() => props.avatarUrl ?? '')

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function onConfigure() {
  showMenu.value = false
  emit('configure')
}

function onLogout() {
  showMenu.value = false
  emit('logout')
}

const initials = computed(() => {
  const name = username.value.trim()
  if (!name) return 'U'
  const parts = name.split(' ')
  const a = parts[0]?.[0] ?? ''
  const b = parts[1]?.[0] ?? ''
  const value = (a + b).toUpperCase()
  return value || 'U'
})
</script>

<style scoped>
.header-user {
  position: relative;
  display: inline-block;
}

.user-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.6rem;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  border-radius: var(--radius-lg);
}

.user-btn:focus {
  outline: 2px solid var(--color-primary-light);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  object-fit: cover;
  background: var(--bg-quaternary);
  display: inline-block;
}

.avatar--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  background: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.username {
  font-weight: var(--font-weight-semibold);
  margin-right: 0.2rem;
  color: var(--color-text-primary);
}

.chev {
  opacity: 0.8;
}

.menu {
  position: absolute;
  right: 0;
  margin-top: var(--spacing-sm);
  min-width: 180px;
  background: var(--bg-primary);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-lg);
  padding: 0.4rem;
  z-index: var(--z-dropdown);
  border: 1px solid var(--color-border);
}

.menu-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: var(--spacing-md) 0.8rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-normal);
}

.menu-item:hover {
  background: var(--bg-secondary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
