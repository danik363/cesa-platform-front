<template>
  <div class="login-page">
    <div class="login-card">
      <img src="@/assets/cesa-logo-full.svg" alt="Cesa logo" class="logo" />
      <h2 class="title">Iniciar sesión</h2>

      <form @submit.prevent="onSubmit" class="form">
        <div class="field">
          <label for="username">Usuario</label>
          <input id="username" v-model="username" type="text" autocomplete="username" />
        </div>

        <div class="field">
          <label for="password">Contraseña</label>
          <input id="password" v-model="password" type="password" autocomplete="current-password" />
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <button class="btn" type="submit" :disabled="loading">
          <span v-if="loading"><i class="fas fa-spinner fa-spin"></i> Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <p class="note">Usuario y contraseña simples — sin registro. Administrador crea cuentas.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/store/auth'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const router = useRouter()
const route = useRoute()
const { push: pushToast } = useToast()

async function onSubmit() {
  error.value = null

  if (!username.value.trim() || !password.value.trim()) {
    error.value = 'Por favor ingrese usuario y contraseña.'
    pushToast('Faltan campos por completar', 'error')
    return
  }

  loading.value = true
  const auth = useAuthStore()
  try {
    await auth.login(username.value.trim(), password.value.trim())
    pushToast('Ingreso exitoso', 'success')
    // redirect to intended route or home
    const redirect = route.query.redirect as string | undefined
    router.push(redirect || '/')
  } catch (err: any) {
    console.error('login error', err)
    error.value = err?.message || 'Error al iniciar sesión. Intente nuevamente.'
    pushToast('Error en el ingreso', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg-secondary);
}

.login-card {
  width: 380px;
  max-width: 100%;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 28px;
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.logo {
  width: 220px;
  height: auto;
  margin: 0 auto 8px;
}

.title {
  margin: 6px 0 18px;
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.field {
  text-align: left;
}

.field label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: 6px;
  font-weight: var(--font-weight-medium);
}

.field input {
  width: 100%;
  padding: var(--spacing-sm) 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  background-color: var(--bg-primary);
  color: var(--color-text-primary);
}

.btn {
  background: var(--color-primary-dark);
  color: var(--color-white);
  border: none;
  padding: var(--spacing-sm) 0.875rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.btn[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  text-align: left;
  padding: var(--spacing-sm);
  background: var(--color-error-bg);
  border-radius: var(--radius-md);
}

.note {
  margin-top: 14px;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}
</style>
