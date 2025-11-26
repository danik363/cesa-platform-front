import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { requiresAuth: true } },
  { path: '/prompts', name: 'prompts', component: () => import('@/views/CustomPrompts.vue'), meta: { requiresAuth: true } },
  { path: '/files', name: 'files', component: () => import('@/views/FilesView.vue'), meta: { requiresAuth: true } },
  { path: '/organizations', name: 'organizations', component: () => import('@/views/OrganizationsView.vue'), meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/organizations/agents', name: 'agents', component: () => import('@/views/AgentsView.vue'), meta: { requiresAuth: true } },
  { path: '/organizations/agents/:id', name: 'agent-edit', component: () => import('@/views/AgentEditView.vue'), meta: { requiresAuth: true } },
  { path: '/users', name: 'users', component: () => import('@/views/UsersView.vue'), meta: { requiresAuth: true, roles: ['ADMIN'] } },
  { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue'), meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  // allow public login
  if (to.path === '/login') return next()

  // if route requires auth and user not authenticated -> redirect to login
  if (to.meta?.requiresAuth && !auth.isAuthenticated()) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // if route specifies roles, check user role
  const roles = (to.meta?.roles || []) as string[]
  if (roles.length > 0) {
    const userRole = auth.user?.role
    if (!userRole || !roles.includes(userRole)) {
      // unauthorized: redirect to home
      return next({ path: '/' })
    }
  }

  return next()
})

export default router
