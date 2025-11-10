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
  border-radius: 8px;
}
.user-btn:focus { outline: 2px solid rgba(100,108,255,0.25); }
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: #d9d9d9;
  display: inline-block;
}
.avatar--fallback {
  display:flex;align-items:center;justify-content:center;color:#fff;background:#9aa8ff;font-weight:600
}
.username { font-weight:600; margin-right:0.2rem }
.chev { opacity:0.8 }
.menu {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  min-width: 180px;
  background: var(--menu-bg, #fff);
  color: var(--menu-color, #213547);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  border-radius: 8px;
  padding: 0.4rem;
  z-index: 50;
}
.menu-item {
  display:block;width:100%;text-align:left;padding:0.6rem 0.8rem;border:none;background:transparent;cursor:pointer;border-radius:6px
}
.menu-item:hover { background: rgba(0,0,0,0.04) }

.fade-enter-active, .fade-leave-active { transition: opacity 120ms ease, transform 120ms ease }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-6px) }
</style>
