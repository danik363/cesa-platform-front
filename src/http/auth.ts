import { api } from './index'

export interface AuthResponse {
  token: string
  user: {
    username: string
    role: 'BASIC' | 'ADMIN'
  }
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  // If there is no API configured, simulate login locally
  if (!api.defaults.baseURL) {
    // mimic network latency
    await new Promise((resv) => setTimeout(resv, 500))
    // hardcoded behaviour for development: only username 'admin' with password 'admin' is ADMIN
    console.log(username, password)
    if (username === 'admin' && password === 'admin') {
      const token = btoa(`${username}:${Date.now()}`)
      const res: AuthResponse = { token, user: { username, role: 'ADMIN' } }
      return res
    }

    // allow other users as BASIC if they provide a non-empty username/password
    if (username && password) {
      const token = btoa(`${username}:${Date.now()}`)
      const res: AuthResponse = { token, user: { username, role: 'BASIC' } }
      return res
    }

    // otherwise reject
    throw new Error('Invalid credentials')
  }

  const resp = await api.post('/auth/login', { username, password })
  return resp.data as AuthResponse
}

export function logout(): void {
  // if backend has logout endpoint, call it. For now just clear client storage
  localStorage.removeItem('auth.token')
  localStorage.removeItem('auth.user')
}
