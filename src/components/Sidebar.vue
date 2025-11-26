<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'

defineProps<{
  isExpanded?: boolean
}>()
// we'll navigate with vue-router directly
import { useRouter } from 'vue-router'
const router = useRouter()

const { t } = useI18n()

type SidebarItem = { key: string; icon: string; label: string; active: boolean; roles?: string[]; children?: SidebarItem[] }
const items = ref<SidebarItem[]>([
    { key: 'home', icon: 'fa-solid fa-home', label: t('sidebar.home'), active: true },
    { key: 'users', icon: 'fa-solid fa-users', label: t('sidebar.users'), active: false, roles: ['ADMIN'] },
  { key: 'prompts', icon: 'fa-regular fa-file-lines', label: t('sidebar.customPrompt'), active: false },
  { key: 'organizations', icon: 'fa-solid fa-building', label: t('sidebar.organizations'), active: false, roles: ['ADMIN'], children: [
    { key: 'agents', icon: 'fa-solid fa-robot', label: t('sidebar.agents'), active: false, roles: ['ADMIN'] }
  ] },
  { key: 'files', icon: 'fa-regular fa-file', label: t('sidebar.files'), active: false },
    { key: 'settings', icon: 'fa-solid fa-gears', label: t('sidebar.settings'), active: false }
])

const auth = useAuthStore()

const visibleItems = computed(() => {
  return items.value.filter(i => {
    if (!i.roles) return true
    const userRole = auth.user?.role
    return !!userRole && i.roles.includes(userRole)
  })
})

const expandedItems = ref<Set<string>>(new Set())

function toggleExpand(key: string) {
  if (expandedItems.value.has(key)) {
    expandedItems.value.delete(key)
  } else {
    expandedItems.value.add(key)
  }
}

function changeActive(selectedItem: SidebarItem) {
  items.value.forEach(item => {
    item.active = (item === selectedItem)
    if (item.children) {
      item.children.forEach(child => {
        child.active = (child === selectedItem)
      })
    }
  })
  // map keys to routes
  const map: Record<string,string> = { home: '/', users: '/users', prompts: '/prompts', organizations: '/organizations', agents: '/organizations/agents', files: '/files', settings: '/settings' }
  const path = map[selectedItem.key] ?? '/'
  router.push(path)
}

</script>
<template>
  <aside id="main-sidebar" class="sidebar" :class="{ 'sidebar--expanded': isExpanded }">
    <div class="brand sidebar__header">
      <div class="logo">
        <img v-if="isExpanded" class="logo__img" src="@/assets/cesa-logo-full.svg" alt="">
        <img v-if="!isExpanded" class="logo__img logo-collapse" src="@/assets/cesa-logo-collapse.svg" alt="">
      </div>
      <div class="brand-name"></div>
    </div>
    <div class="sidebar__body">
        <nav class="menu">
        <ul>
            <li v-for="item in visibleItems" :key="item.label" :class="{active: item.active}">
            <button class="menu-btn" @click="item.children ? toggleExpand(item.key) : changeActive(item)">
                <span class="ico" aria-hidden="true"><i :class="item.icon"></i></span>
                <span class="label">{{ item.label }}</span>
                <span v-if="item.children" class="expand-icon">
                  <i :class="expandedItems.has(item.key) ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right'"></i>
                </span>
            </button>
            <ul v-if="item.children && expandedItems.has(item.key)" class="submenu">
              <li v-for="child in item.children" :key="child.key" :class="{active: child.active}">
                <button class="menu-btn submenu-btn" @click="changeActive(child)">
                  <span class="ico" aria-hidden="true"><i :class="child.icon"></i></span>
                  <span class="label">{{ child.label }}</span>
                </button>
              </li>
            </ul>
            </li>
        </ul>
        </nav>
    </div>
  </aside>
</template>


<style scoped>
.sidebar {
  width: 240px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--color-border-subtle);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-lg) 0;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0 var(--spacing-lg);
}

.logo__img {
  width: 130px;
  height: auto;
}

.logo-collapse {
  width: 32px;
  height: auto;
}

.sidebar__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-lg);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
}

.brand-name {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.menu {
  margin-top: var(--spacing-lg);
}

.menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem var(--spacing-lg);
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.menu-btn.small {
  font-size: 0.85rem;
  padding: 0.4rem;
}

.menu .label {
  flex: 1;
  color: var(--color-text-primary);
}

.menu .ico {
  width: 28px;
  text-align: center;
  color: var(--color-text-primary);
}

.menu li.active > .menu-btn {
  background: linear-gradient(90deg, var(--color-primary-light), var(--color-white));
  border-left: 3px solid var(--color-primary);
}

.expand-icon {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.submenu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.submenu .menu-btn {
  padding-left: 3rem;
}

.submenu-btn {
  font-size: 0.85rem;
}

.sidebar-footer {
  padding: 0.6rem var(--spacing-lg);
}

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

@media (max-width: 600px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform var(--transition-base);
    z-index: var(--z-sidebar);
    background: var(--bg-secondary);
  }

  .sidebar--open {
    transform: translateX(0);
  }
}

@media (max-width: 600px) {
  .sidebar--open::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-overlay);
    z-index: calc(var(--z-sidebar) - 1);
  }
}
</style>
