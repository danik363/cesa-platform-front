import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/prompts', name: 'prompts', component: () => import('../views/CustomPrompts.vue') },
  { path: '/files', name: 'files', component: () => import('../views/FilesView.vue') },
  { path: '/users', name: 'users', component: () => import('../views/UsersView.vue') },
  { path: '/settings', name: 'settings', component: () => import('../views/SettingsView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
