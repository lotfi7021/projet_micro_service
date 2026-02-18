<template>
  <div class="reclamation-form card">
    <h3>Envoyer une Réclamation</h3>

    <form @submit.prevent="submitReclamation">
      <div class="form-group">
        <label>Type de réclamation *</label>
        <select v-model="form.typeId" required>
          <option value="" disabled>Sélectionner un type</option>
          <option v-for="type in types" :key="type.id" :value="type.id">
            {{ type.typeReclamation }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Description *</label>
        <textarea
          v-model="form.description"
          rows="5"
          placeholder="Décrivez votre problème ou demande..."
          required
        ></textarea>
      </div>

      <button type="submit" :disabled="loading" class="btn btn-submit">
        {{ loading ? 'Envoi en cours...' : 'Envoyer la réclamation' }}
      </button>
    </form>

    <p v-if="success" class="success">Réclamation envoyée avec succès !</p>
    <p v-if="error" class="error">{{ error }}</p>
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
  typeId: '',
  description: ''
})

const fetchTypes = async () => {
  try {
    const { data } = await api.get('/reclamations/types') // If you add this endpoint, or hardcode if not
    types.value = data
  } catch (err) {
    console.error('Erreur chargement types:', err)
    // Fallback hardcoded (from your DataInitializer)
    types.value = [
      { id: 1, typeReclamation: 'NOTIFICATION' },
      { id: 2, typeReclamation: 'MANQUE_STOCK' },
      { id: 3, typeReclamation: 'PROBLEM_SERVER' }
    ]
  }
}

const submitReclamation = async () => {
  try {
    loading.value = true
    success.value = false
    error.value = ''

    await api.post('/reclamations', {
      typeReclamationId: form.value.typeId,
      description: form.value.description,
      // nomUser & matricule & role are automatically added by backend
    })

    success.value = true
    form.value = { typeId: '', description: '' }
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur lors de l\'envoi'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTypes)
</script>

<style scoped>
.card { padding: 24px; background: white; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; font-weight: 500; }
select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
.btn-submit { background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; }
.success { color: #27ae60; margin-top: 16px; }
.error { color: #e74c3c; margin-top: 16px; }
</style>