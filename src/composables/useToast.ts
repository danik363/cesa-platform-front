import { ref } from 'vue'

export type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string }

const toasts = ref<Toast[]>([])
let idCounter = 1

export function useToast() {
  function push(message: string, type: Toast['type'] = 'info', timeout = 4000) {
    const id = idCounter++
    const t = { id, type, message }
    toasts.value.push(t)
    if (timeout > 0) setTimeout(() => remove(id), timeout)
    return id
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  return { toasts, push, remove }
}

export default useToast
