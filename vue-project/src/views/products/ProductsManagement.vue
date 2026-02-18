<template>
  <div class="products-management">
    <h1>Gestion des Produits</h1>

    <div v-if="loading" class="status">Chargement...</div>
    <div v-if="error" class="status error">{{ error }}</div>

    <!-- CREATE FORM -->
    <div class="create-form card">
      <h3>Ajouter un nouveau produit</h3>
      <form @submit.prevent="createProduct" class="form-grid">
        <input v-model="newProduct.name" placeholder="Nom du produit *" required />
        <input v-model="newProduct.matricule" placeholder="Matricule (optionnel)" />
        <input v-model="newProduct.description" placeholder="Description" />
        <input v-model.number="newProduct.price" type="number" step="0.01" placeholder="Prix de vente *" required />
        <input v-model.number="newProduct.quantite" type="number" placeholder="Quantité initiale *" required min="0" />
        <input v-model.number="newProduct.prix_achat" type="number" step="0.01" placeholder="Prix d'achat" />

        <select v-model="newProduct.product_type_id" required>
          <option value="" disabled>Type de produit *</option>
          <option v-for="type in productTypes" :key="type.id" :value="type.id">
            {{ type.name }}
          </option>
        </select>

        <select v-model="newProduct.product_location_id">
          <option value="">Emplacement (facultatif)</option>
          <option v-for="loc in productLocations" :key="loc.id" :value="loc.id">
            {{ loc.name }}
          </option>
        </select>

        <button type="submit" :disabled="loading" class="btn btn-primary">
          Créer le produit
        </button>
      </form>
    </div>

    <!-- PRODUCTS TABLE -->
    <div class="table-container card">
      <h3>Liste des produits ({{ products.length }})</h3>

      <table v-if="products.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Prix vente</th>
            <th>Quantité</th>
            <th>Type</th>
            <th>Emplacement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.matricule }}</td>

            <td>
              <input
                v-if="editingId === product.id"
                v-model="editForm.name"
                required
              />
              <span v-else>{{ product.name }}</span>
            </td>

            <td>
              <input
                v-if="editingId === product.id"
                v-model.number="editForm.price"
                type="number"
                step="0.01"
              />
              <span v-else>{{ parseFloat(product.price).toFixed(2) }} DA</span>
            </td>

            <td>
              <input
                v-if="editingId === product.id"
                v-model.number="editForm.quantite"
                type="number"
                min="0"
              />
              <span v-else>{{ product.quantite }}</span>
            </td>

            <td>
              <select
                v-if="editingId === product.id"
                v-model="editForm.product_type_id"
                required
              >
                <option v-for="type in productTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
              <span v-else>{{ product.type_name || '-' }}</span>
            </td>

            <td>
              <select
                v-if="editingId === product.id"
                v-model="editForm.product_location_id"
              >
                <option value="">Aucun</option>
                <option v-for="loc in productLocations" :key="loc.id" :value="loc.id">
                  {{ loc.name }}
                </option>
              </select>
              <span v-else>{{ product.location_name || '-' }}</span>
            </td>

            <td class="actions">
              <div v-if="editingId === product.id">
                <button @click="saveEdit(product.id)" class="btn btn-save">
                  Enregistrer
                </button>
                <button @click="cancelEdit" class="btn btn-cancel">
                  Annuler
                </button>
              </div>
              <div v-else>
                <button @click="startEdit(product)" class="btn btn-edit">
                  Modifier
                </button>
                <button @click="deleteProduct(product.id)" class="btn btn-delete">
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else class="empty">Aucun produit trouvé</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/axios'

const router = useRouter()

const products = ref([])
const productTypes = ref([])
const productLocations = ref([])

const loading = ref(false)
const error = ref('')

const newProduct = ref({
  name: '',
  matricule: '',
  description: '',
  price: '',
  quantite: '',
  prix_achat: '',
  product_type_id: '',
  product_location_id: ''
})

// ========== TOKEN VERIFICATION ==========
const verifyStockManagerToken = () => {
  console.log('🔍 Verifying GESTIONNAIRE_STOCK token...') // ADD THIS

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')

  console.log('Token:', token ? '✅ Exists' : '❌ Missing') // ADD THIS
  console.log('Role:', role) // ADD THIS
  console.log('Username:', username) // ADD THIS

  // Check if token exists
  if (!token || !role || !username) {
    console.log('❌ Token verification FAILED - missing data') // ADD THIS

    alert('❌ Session expirée. Veuillez vous reconnecter.')
    localStorage.clear()
    router.push('/login')
    return false
  }

  // Check if user is GESTIONNAIRE_STOCK or ADMIN (admins can also manage stock)
  if (role !== 'GESTIONNAIRE_STOCK' && role !== 'ADMIN') {
    console.log('❌ Token verification FAILED - wrong role:', role) // ADD THIS

    alert('❌ Accès refusé : Cette action est réservée aux gestionnaires de stock.')
    router.push('/login')
    return false
  }
  console.log('✅ Token verification PASSED for GESTIONNAIRE_STOCK') // ADD THIS

  return true
}

const fetchProducts = async () => {
  try {
    loading.value = true
    const { data } = await api.get('/api/products')
    products.value = data
    error.value = ''
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide ou expiré. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else {
      error.value = 'Impossible de charger les produits'
      console.error('Erreur:', err)
    }
  } finally {
    loading.value = false
  }
}

const fetchProductTypes = async () => {
  const { data } = await api.get('/api/product-types')
  productTypes.value = data
}

const fetchProductLocations = async () => {
  const { data } = await api.get('/api/product-locations')
  productLocations.value = data
}

const createProduct = async () => {
  // Verify token before creating
  if (!verifyStockManagerToken()) return

  try {
    loading.value = true

    const payload = {
      name: newProduct.value.name,
      matricule: newProduct.value.matricule || null,
      description: newProduct.value.description || null,
      price: parseFloat(newProduct.value.price),
      quantite: parseInt(newProduct.value.quantite),
      prix_achat: newProduct.value.prix_achat ? parseFloat(newProduct.value.prix_achat) : null,
      product_type_id: newProduct.value.product_type_id,
      product_location_id: newProduct.value.product_location_id || null
    }

    await api.post('/api/products', payload)

    resetNewProduct()
    await fetchProducts()
    alert('✅ Produit créé avec succès')
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else {
      error.value = err.response?.data?.error || 'Erreur création produit'
    }
  } finally {
    loading.value = false
  }
}

const resetNewProduct = () => {
  newProduct.value = {
    name: '',
    matricule: '',
    description: '',
    price: '',
    quantite: '',
    prix_achat: '',
    product_type_id: '',
    product_location_id: ''
  }
}

const editingId = ref(null)
const editForm = ref({})

const startEdit = (product) => {
  // Verify token before editing
  if (!verifyStockManagerToken()) return

  editingId.value = product.id
  editForm.value = {
    name: product.name,
    price: product.price,
    quantite: product.quantite,
    product_type_id: product.product_type_id,
    product_location_id: product.product_location_id
  }
}

const saveEdit = async (id) => {
  // Verify token before saving
  if (!verifyStockManagerToken()) return

  try {
    const product = products.value.find(p => p.id === id)
    
    const payload = {
      name: editForm.value.name,
      description: product.description || null,
      price: parseFloat(editForm.value.price),
      quantite: parseInt(editForm.value.quantite),
      product_type_id: editForm.value.product_type_id,
      product_location_id: editForm.value.product_location_id || null,
      matricule: product.matricule,
      prix_achat: product.prix_achat || null,
      prix_vente: parseFloat(editForm.value.price)
    }
    
    await api.put(`/api/products/${id}`, payload)
    await fetchProducts()
    cancelEdit()
    alert('✅ Produit modifié avec succès')
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else {
      error.value = err.response?.data?.error || 'Erreur modification produit'
      console.error('Erreur update:', err)
    }
  }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = {}
}

const deleteProduct = async (id) => {
  // Verify token before deleting
  if (!verifyStockManagerToken()) return

  if (!confirm('⚠️ Vraiment supprimer ce produit ?')) return

  try {
    await api.delete(`/api/products/${id}`)
    products.value = products.value.filter(p => p.id !== id)
    alert('✅ Produit supprimé')
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else {
      error.value = 'Erreur lors de la suppression'
    }
  }
}

onMounted(async () => {
  // Verify token on component mount
  if (!verifyStockManagerToken()) return

  loading.value = true
  await Promise.all([
    fetchProducts(),
    fetchProductTypes(),
    fetchProductLocations()
  ])
  loading.value = false
})
</script>

<style scoped>
.products-management {
  max-width: 1200px;
  margin: auto;
  padding: 24px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

input,
select {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 0.95rem;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3498db;
}

button {
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: background 0.3s;
}

.btn-primary {
  background: #3498db;
  color: #fff;
}

.btn-primary:hover {
  background: #2980b9;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit {
  background: #f1c40f;
  color: #fff;
}

.btn-edit:hover {
  background: #d4ac0d;
}

.btn-save {
  background: #2ecc71;
  color: #fff;
}

.btn-save:hover {
  background: #27ae60;
}

.btn-cancel {
  background: #95a5a6;
  color: #fff;
}

.btn-cancel:hover {
  background: #7f8c8d;
}

.btn-delete {
  background: #e74c3c;
  color: #fff;
}

.btn-delete:hover {
  background: #c0392b;
}

.status {
  padding: 12px;
  margin: 12px 0;
  border-radius: 6px;
  background: #e3f2fd;
  color: #1976d2;
}

.status.error {
  background: #ffebee;
  color: #c0392b;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-style: italic;
}
</style>