<template>
  <div class="product-locations-management">
    <h1>Gestion des Emplacements de Produits</h1>

    <div v-if="loading" class="status-message">Chargement...</div>
    <div v-if="error" class="status-message error">{{ error }}</div>

    <!-- CREATE FORM -->
    <div class="create-section card">
      <h3>Ajouter un nouvel emplacement</h3>
      <form @submit.prevent="createLocation" class="form-grid">
        <input
          v-model="newLocation.name"
          placeholder="Nom de l'emplacement *"
          required
          autofocus
        />
        <textarea
          v-model="newLocation.description"
          placeholder="Description (facultatif)"
          rows="2"
        ></textarea>
        <button
          type="submit"
          :disabled="loading || !newLocation.name.trim()"
          class="btn btn-primary"
        >
          Créer l'emplacement
        </button>
      </form>
    </div>

    <!-- LIST + INLINE EDIT -->
    <div class="list-section card">
      <h3>Liste des emplacements ({{ locations.length }})</h3>

      <table v-if="locations.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="location in locations" :key="location.id">
            <td>{{ location.id }}</td>

            <td>
              <input
                v-if="editingId === location.id"
                v-model="editForm.name"
                required
              />
              <span v-else>{{ location.name }}</span>
            </td>

            <td>
              <textarea
                v-if="editingId === location.id"
                v-model="editForm.description"
                rows="2"
              ></textarea>
              <span v-else>{{ location.description || '-' }}</span>
            </td>

            <td class="actions">
              <div v-if="editingId === location.id">
                <button @click="saveEdit(location.id)" class="btn save">Enregistrer</button>
                <button @click="cancelEdit" class="btn cancel">Annuler</button>
              </div>
              <div v-else>
                <button @click="startEdit(location)" class="btn edit">Modifier</button>
                <button @click="deleteLocation(location.id)" class="btn delete">Supprimer</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="empty">Aucun emplacement enregistré pour le moment</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'

const locations = ref([])
const loading = ref(false)
const error = ref('')

// CREATE
const newLocation = ref({
  name: '',
  description: ''
})

const createLocation = async () => {
  if (!newLocation.value.name.trim()) return

  try {
    loading.value = true
    await api.post('/api/product-locations', newLocation.value)

    newLocation.value = { name: '', description: '' }
    await fetchLocations()
    alert('Emplacement créé avec succès')
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}

// READ - Get All
const fetchLocations = async () => {
  try {
    loading.value = true
    const { data } = await api.get('/api/product-locations')
    locations.value = data
  } catch (err) {
    error.value = 'Impossible de charger les emplacements'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// UPDATE
const editingId = ref(null)
const editForm = ref({})

const startEdit = (location) => {
  editingId.value = location.id
  editForm.value = {
    name: location.name,
    description: location.description || ''
  }
}

const saveEdit = async (id) => {
  if (!editForm.value.name.trim()) {
    alert('Le nom est obligatoire')
    return
  }

  try {
    await api.put(`/api/product-locations/${id}`, editForm.value)
    await fetchLocations()
    cancelEdit()
    alert('Emplacement modifié avec succès')
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la modification'
  }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = {}
}

// DELETE
const deleteLocation = async (id) => {
  if (!confirm('Voulez-vous vraiment supprimer cet emplacement ?')) return

  try {
    await api.delete(`/api/product-locations/${id}`)
    locations.value = locations.value.filter(l => l.id !== id)
    alert('Emplacement supprimé avec succès')
  } catch (err) {
    error.value = err.response?.data?.error ||
      'Impossible de supprimer (peut-être utilisé par des produits ?)'
  }
}

onMounted(fetchLocations)
</script>

<style scoped>
.product-locations-management {
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 24px;
  margin-bottom: 32px;
}

.form-grid {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}

input, textarea {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary { background: #2563eb; color: white; }
.btn-edit    { background: #3b82f6; color: white; }
.btn-save    { background: #16a34a; color: white; }
.btn-cancel  { background: #6b7280; color: white; }
.btn-delete  { background: #dc2626; color: white; }

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

th, td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
}

.actions {
  white-space: nowrap;
}

.actions .btn {
  margin-right: 8px;
  margin-bottom: 4px;
}

.status-message {
  padding: 12px;
  margin: 16px 0;
  border-radius: 6px;
}

.error {
  background: #fee2e2;
  color: #b91c1c;
}

.empty {
  color: #6b7280;
  font-style: italic;
  padding: 20px;
  text-align: center;
}
</style>