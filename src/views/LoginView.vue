<template>
  <div class="login-page">
    <div class="login-card">
      <img src="../assets/cesa-logo-full.svg" alt="Cesa logo" class="logo" />
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
import { useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const router = useRouter()
const { push: pushToast } = useToast()

async function onSubmit() {
  error.value = null

  if (!username.value.trim() || !password.value.trim()) {
    error.value = 'Por favor ingrese usuario y contraseña.'
    pushToast('Faltan campos por completar', 'error')
    return
  }

  loading.value = true
  try {
    // Simulate an async login process. Replace with real API call if you have one.
    await new Promise<void>((res) => setTimeout(() => res(), 900))

    // On success, show toast and navigate home.
    router.push({ path: '/' })
  } catch (err) {
    console.error('login error', err)
    error.value = 'Error al iniciar sesión. Intente nuevamente.'
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
  background: var(--bg, #f7f9fb);
}

.login-card {
  width: 380px;
  max-width: 100%;
  background: white;
  border-radius: 8px;
  padding: 28px;
  box-shadow: 0 8px 30px rgba(20, 30, 50, 0.08);
  text-align: center;
}

.logo {
  width: 220px;
  height: auto;
  margin: 0 auto 8px;
}

.title {
  margin: 6px 0 18px;
  font-size: 18px;
  color: #1f2937;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  text-align: left;
}

.field label {
  display: block;
  font-size: 13px;
  color: #374151;
  margin-bottom: 6px;
}

.field input {
  width: -webkit-fill-available;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
}

.btn {
  background: #0f172a;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #b91c1c;
  font-size: 13px;
  text-align: left;
}

.note {
  margin-top: 14px;
  font-size: 12px;
  color: #6b7280;
}
</style>
