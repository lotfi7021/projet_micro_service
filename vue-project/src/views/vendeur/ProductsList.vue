<template>
  <div class="vendeur-products">
    <h1>Liste des Produits</h1>

    <div v-if="loading" class="status">Chargement des produits...</div>
    <div v-if="error" class="status error">{{ error }}</div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom, matricule ou description..."
        class="search-input"
      />
    </div>

    <div class="table-container card">
      <table v-if="filteredProducts.length">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Prix de vente</th>
            <th>Quantité en stock</th>
            <th>Type</th>
            <th>Emplacement</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td><strong>{{ product.matricule || '-' }}</strong></td>
            <td>{{ product.name }}</td>
            <td>{{ parseFloat(product.price).toFixed(2) }} DA</td>

            <td :class="{ 'low-stock': product.quantite < 10 }">
              {{ product.quantite }}
              <span v-if="product.quantite < 10" class="warning"> (Stock faible)</span>
            </td>
            <td>{{ product.type_name || '-' }}</td>
            <td>{{ product.location_name || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="empty">
        {{ searchQuery ? 'Aucun produit correspondant à votre recherche' : 'Aucun produit disponible' }}
      </p>
    </div>
  </div>

  <!-- After <h1>Liste des Produits</h1> -->
<router-link to="/vendeur/factures/create" class="btn btn-primary">
  Créer une Facture
</router-link>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/utils/axios'

const products = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')

// Load products
const fetchProducts = async () => {
  try {
    loading.value = true
    const { data } = await api.get('/api/products')
    products.value = data
  } catch (err) {
    error.value = 'Impossible de charger la liste des produits'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Filtered products based on search
const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value

  const query = searchQuery.value.toLowerCase()
  return products.value.filter(product =>
    product.name.toLowerCase().includes(query) ||
    (product.matricule && product.matricule.toLowerCase().includes(query)) ||
    (product.description && product.description.toLowerCase().includes(query))
  )
})

onMounted(fetchProducts)
</script>

<style scoped>
.vendeur-products {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 24px;
  color: #2c3e50;
}

.search-bar {
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  max-width: 500px;
  padding: 12px 16px;
  font-size: 1.1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 24px;
  overflow-x: auto;
}

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
  color: #34495e;
}

.low-stock {
  color: #e67e22;
  font-weight: bold;
}

.warning {
  color: #c0392b;
  font-size: 0.9rem;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
  font-style: italic;
}

.status {
  padding: 12px;
  margin: 16px 0;
  border-radius: 6px;
  text-align: center;
}

.error {
  background: #fee2e2;
  color: #b91c1c;
}

.btn-primary {
  display: inline-block;
  padding: 12px 20px;
  background: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  margin-bottom: 24px;
}
</style>