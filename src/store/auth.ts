import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as authApi from '@/http/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<{ username: string; role: 'BASIC' | 'ADMIN' } | null>(null)

  // initialize from localStorage
  try {
    const storedToken = localStorage.getItem('auth.token')
    const storedUser = localStorage.getItem('auth.user')
    token.value = storedToken || null
    user.value = storedUser ? JSON.parse(storedUser) : null
  } catch (e) {
    token.value = null
    user.value = null
  }

  function setAuth(tkn: string, usr: { username: string; role: 'BASIC' | 'ADMIN' }) {
    token.value = tkn
    user.value = usr
    try {
      localStorage.setItem('auth.token', tkn)
      localStorage.setItem('auth.user', JSON.stringify(usr))
    } catch (e) {}
  }

  async function login(username: string, password: string) {
    const res = await authApi.login(username, password)
    setAuth(res.token, res.user)
    return res
  }

  function logout() {
    authApi.logout()
    token.value = null
    user.value = null
  }

  const isAuthenticated = () => Boolean(token.value)
  const hasRole = (r: string) => user.value?.role === r

  return { token, user, setAuth, login, logout, isAuthenticated, hasRole }
})
