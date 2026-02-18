<template>
  <div id="app" class="login-container">
    <h2>Connexion</h2>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>Nom d'utilisateur</label>
        <input v-model="username" type="text" required autocomplete="username" />
      </div>

      <div class="form-group">
        <label>Mot de passe</label>
        <input v-model="password" type="password" required autocomplete="current-password" />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Connexion..." : "Se connecter" }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/axios' // CHANGED: Import from your configured axios file instead of direct axios

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // CHANGED: Use api instead of axios.post() with full URL
    const response = await api.post('/auth/login', {
      username: username.value,
      password: password.value
    })

    const { token, username: userName, role } = response.data

    // Save to localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('username', userName)
    localStorage.setItem('role', role)

    // Small normalization of role name
    let dashboardPath = ''
    switch (role.toUpperCase()) {
      case 'ADMIN':
        dashboardPath = '/admin'
        break
      case 'GESTIONNAIRE_STOCK':
        dashboardPath = '/stock'
        break
      case 'VENDEUR':
        dashboardPath = '/vendeur'
        break
      default:
        throw new Error('Rôle inconnu')
    }

    router.push(dashboardPath)
  } catch (err) {
    error.value = err.response?.data?.message || 'Identifiants incorrects'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 12px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #95a5a6;
}

.error {
  color: #c0392b;
  margin-top: 10px;
  text-align: center;
}
</style>