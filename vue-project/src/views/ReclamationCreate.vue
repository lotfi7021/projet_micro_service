<template>
  <div class="reclamation-page">
    <h1>Envoyer une Réclamation</h1>

    <div class="card">
      <h3>Nouvelle Réclamation</h3>

      <form @submit.prevent="submitReclamation">
        <div class="form-group">
          <label>Type de réclamation *</label>
          <select v-model="form.typeReclamationId" required>
            <option value="" disabled>Sélectionner...</option>
            <option v-for="type in types" :key="type.id" :value="type.id">
              {{ type.typeReclamation }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Description du problème *</label>
          <textarea
            v-model="form.description"
            rows="6"
            placeholder="Décrivez votre réclamation en détail..."
            required
          ></textarea>
        </div>

        <button type="submit" :disabled="loading" class="btn btn-submit">
          {{ loading ? 'Envoi...' : 'Envoyer' }}
        </button>
      </form>

      <p v-if="success" class="success-message">Réclamation envoyée avec succès !</p>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'

const types = ref([])
const loading = ref(false)
const success = ref(false)
const error = ref('')

const form = ref({
  typeReclamationId: '',
  description: ''
})

// Load types (hardcoded fallback if no endpoint)
const fetchTypes = () => {
  // You can replace with real API call later: api.get('/reclamations/types')
  types.value = [
    { id: 1, typeReclamation: 'NOTIFICATION' },
    { id: 2, typeReclamation: 'MANQUE_STOCK' },
    { id: 3, typeReclamation: 'PROBLEM_SERVER' }
  ]
}

const submitReclamation = async () => {
  if (!form.value.typeReclamationId) {
    error.value = 'Veuillez sélectionner un type'
    return
  }

  try {
    loading.value = true
    success.value = false
    error.value = ''

    // Find the selected type name
    const selectedType = types.value.find(t => t.id === parseInt(form.value.typeReclamationId))
    
    if (!selectedType) {
      error.value = 'Type de réclamation invalide'
      return
    }

    // Get user info from localStorage
    const username = localStorage.getItem('username')
    const role = localStorage.getItem('role')
    const matricule = localStorage.getItem('matricule') // If you store matricule
    
    if (!username || !role) {
      error.value = 'Session expirée. Veuillez vous reconnecter.'
      return
    }

    await api.post('/reclamations', {
      typeReclamation: selectedType.typeReclamation,
      description: form.value.description,
      nomUser: username,
      role: role,
      matricule: matricule || '' // Use empty string if matricule not available
    })

    success.value = true
    form.value = { typeReclamationId: '', description: '' }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'envoi'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchTypes)
</script>

<style scoped>
.reclamation-page {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.btn-submit {
  background: #27ae60;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.05rem;
}

.btn-submit:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.success-message {
  color: #27ae60;
  margin-top: 20px;
  font-weight: 500;
}

.error-message {
  color: #e74c3c;
  margin-top: 20px;
}
</style>