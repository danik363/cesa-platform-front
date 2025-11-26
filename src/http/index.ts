import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_CESA_PLATFORM as string) || ''

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach JWT if present in localStorage
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('auth.token')
    if (token) {
      config.headers = config.headers || {}
      config.headers['Authorization'] = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

// Response interceptor: capture token from auth responses and handle 401
api.interceptors.response.use(
  (response) => {
    // If server returned a token (e.g., on login), persist it
    try {
      const data = response?.data as any
      if (data && data.token) {
        localStorage.setItem('auth.token', data.token)
      }
    } catch (e) {
      // ignore
    }
    return response
  },
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      // clear stored token on unauthorized
      try {
        localStorage.removeItem('auth.token')
        localStorage.removeItem('auth.user')
      } catch (e) {}
      // Optional: redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
