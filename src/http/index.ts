import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_CESA_PLATFORM as string) || ''

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
