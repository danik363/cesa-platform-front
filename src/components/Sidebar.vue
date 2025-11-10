<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  isExpanded?: boolean
}>()
// we'll navigate with vue-router directly
import { useRouter } from 'vue-router'
const router = useRouter()

const { t } = useI18n()

const items = ref([
    { key: 'home', icon: 'fa-solid fa-home', label: t('sidebar.home'), active: true },
    { key: 'users', icon: 'fa-solid fa-users', label: t('sidebar.users'), active: false },
    { key: 'prompts', icon: 'fa-regular fa-file-lines', label: t('sidebar.customPrompt'), active: false },
    { key: 'files', icon: 'fa-regular fa-file', label: t('sidebar.files'), active: false },
    { key: 'settings', icon: 'fa-solid fa-gears', label: t('sidebar.settings'), active: false }
])

function changeActive(selectedItem: { key: string; icon: string; label: string; active: boolean }) {
  items.value.forEach(item => {
    item.active = (item === selectedItem)
  })
  // map keys to routes
  const map: Record<string,string> = { home: '/', users: '/users', prompts: '/prompts', files: '/files', settings: '/settings' }
  const path = map[selectedItem.key] ?? '/'
  router.push(path)
}

</script>
<template>
  <aside id="main-sidebar" class="sidebar" :class="{ 'sidebar--expanded': isExpanded }">
    <div class="brand sidebar__header">
      <div class="logo">
        <img v-if="isExpanded" class="logo__img" src="../assets/cesa-logo-full.svg" alt="">
        <img v-if="!isExpanded" class="logo__img logo-collapse" src="../assets/cesa-logo-collapse.svg" alt="">
      </div>
      <div class="brand-name"></div>
    </div>
    <div class="sidebar__body">
        <nav class="menu">
        <ul>
            <li v-for="item in items" :key="item.label" :class="{active: item.active}">
            <button class="menu-btn" @click="changeActive(item)">
                <span class="ico" aria-hidden="true"><i :class="item.icon"></i></span>
                <span class="label">{{ item.label }}</span>
            </button>
            </li>
        </ul>
        </nav>
    </div>
  </aside>
</template>


<style scoped>
.sidebar{
  width:240px;
  background: #f8fafc;
  border-right:1px solid rgba(16,24,40,0.06);
  display:flex;flex-direction:column;justify-content:space-between;padding:1rem 0;
}
.brand{display:flex;align-items:center; justify-content:center; gap:0.6rem;padding:0 1rem}
.logo__img{width:130px;height:auto}
.logo-collapse{width:32px;height:auto}
.sidebar__body{flex:1;display:flex;flex-direction:column;justify-content:space-between}
.logo{width:36px;height:36px;border-radius:8px;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700}
.brand-name{font-weight:700;color:#213547}
.menu{margin-top:1rem}
.menu ul{list-style:none;margin:0;padding:0}
.menu-btn{display:flex;align-items:center;gap:0.6rem;padding:0.6rem 1rem;border:none;background:transparent;width:100%;text-align:left;cursor:pointer}
.menu-btn.small{font-size:0.85rem;padding:0.4rem}
.menu .label{flex:1;color:#213547}
.menu .ico{width:28px;text-align:center}
.menu li.active .menu-btn{background:linear-gradient(90deg,#eef2ff,#fff);border-left:3px solid #646cff}
.sidebar-footer{padding:0.6rem 1rem}

/* Collapsed state styles (both manual and responsive) */
.sidebar:not(.sidebar--expanded) {
  width: 72px;
}
.sidebar:not(.sidebar--expanded) .brand-name,
.sidebar:not(.sidebar--expanded) .menu .label,
.sidebar:not(.sidebar--expanded) .badge,
.sidebar:not(.sidebar--expanded) .sidebar-footer {
  display: none;
}
.sidebar:not(.sidebar--expanded) .menu .ico {
  width: 100%;
}

/* Base styles for mobile-first approach */
@media (max-width: 600px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 100;
    background: #f8fafc;
  }
  .sidebar--open {
    transform: translateX(0);
  }
}

/* Add overlay when sidebar is open on mobile */
@media (max-width: 600px) {
  .sidebar--open::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: -1;
  }
}
</style>
