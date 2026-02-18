<template>
  <div class="product-types-management">
    <h1>Gestion des Types de Produits</h1>

    <div v-if="loading" class="status-message">Chargement...</div>
    <div v-if="error" class="status-message error">{{ error }}</div>

    <!-- CREATE FORM -->
    <div class="create-section card">
      <h3>Ajouter un nouveau type</h3>
      <form @submit.prevent="createType" class="simple-form">
        <input
          v-model="newTypeName"
          placeholder="Nom du type de produit *"
          required
          autofocus
        />
        <button type="submit" :disabled="loading || !newTypeName.trim()">
          Créer
        </button>
      </form>
    </div>

    <!-- LIST + CRUD -->
    <div class="list-section card">
      <h3>Liste des types ({{ types.length }})</h3>

      <table v-if="types.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom du type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="type in types" :key="type.id">
            <td>{{ type.id }}</td>

            <td>
              <input
                v-if="editingId === type.id"
                v-model="editName"
                required
                autofocus
              />
              <span v-else>{{ type.name }}</span>
            </td>

            <td class="actions">
              <div v-if="editingId === type.id">
                <button @click="saveEdit(type.id)" class="btn save">Enregistrer</button>
                <button @click="cancelEdit" class="btn cancel">Annuler</button>
              </div>
              <div v-else>
                <button @click="startEdit(type)" class="btn edit">Modifier</button>
                <button @click="deleteType(type.id)" class="btn delete">Supprimer</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="empty-message">Aucun type de produit enregistré pour le moment</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'

const types = ref([])
const loading = ref(false)
const error = ref('')

// Create
const newTypeName = ref('')

const createType = async () => {
  const name = newTypeName.value.trim()
  if (!name) return

  try {
    loading.value = true
    await api.post('/api/product-types', { name })
    newTypeName.value = ''
    await fetchTypes()
    alert('Type de produit créé avec succès')
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la création'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Read - Get All
const fetchTypes = async () => {
  try {
    loading.value = true
    const response = await api.get('/api/product-types')
    types.value = response.data
  } catch (err) {
    error.value = 'Impossible de charger les types de produits'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Update
const editingId = ref(null)
const editName = ref('')

const startEdit = (type) => {
  editingId.value = type.id
  editName.value = type.name
}

const saveEdit = async (id) => {
  const newName = editName.value.trim()
  if (!newName) {
    alert('Le nom ne peut pas être vide')
    return
  }

  try {
    await api.put(`/api/product-types/${id}`, { name: newName })
    await fetchTypes()
    cancelEdit()
    alert('Type modifié avec succès')
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors de la modification'
  }
}

const cancelEdit = () => {
  editingId.value = null
  editName.value = ''
}

// Delete
const deleteType = async (id) => {
  if (!confirm('Voulez-vous vraiment supprimer ce type de produit ?')) return

  try {
    await api.delete(`/api/product-types/${id}`)
    types.value = types.value.filter(t => t.id !== id)
    alert('Type de produit supprimé avec succès')
  } catch (err) {
    error.value = err.response?.data?.error ||
      'Erreur suppression (peut-être utilisé par des produits ?)'
  }
}

onMounted(fetchTypes)
</script>

<style scoped>
.product-types-management {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 24px;
  margin-bottom: 32px;
}

.simple-form {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.simple-form input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.simple-form button {
  padding: 10px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.simple-form button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

th, td {
  padding: 12px 16px;
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

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 0.9rem;
}

.edit  { background: #3b82f6; color: white; }
.save  { background: #16a34a; color: white; }
.cancel{ background: #6b7280; color: white; }
.delete{ background: #dc2626; color: white; }

.status-message {
  padding: 12px;
  margin: 16px 0;
  border-radius: 6px;
}

.error {
  background: #fee2e2;
  color: #b91c1c;
}

.empty-message {
  color: #6b7280;
  font-style: italic;
  padding: 20px;
  text-align: center;
}
</style>