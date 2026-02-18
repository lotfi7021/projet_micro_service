<template>
  <div class="facture-creation">
    <div class="header">
      <h1>Créer une Nouvelle Facture</h1>
      <p class="subtitle">Sélectionnez vos produits et générez votre facture PDF</p>
    </div>

    <!-- Status Messages -->
    <transition name="fade">
      <div v-if="loading" class="alert alert-info">
        <span class="spinner"></span>
        Traitement en cours...
      </div>
    </transition>

    <transition name="fade">
      <div v-if="error" class="alert alert-error">
        <span class="icon">⚠️</span>
        {{ error }}
      </div>
    </transition>

    <div class="main-content">
      <!-- Product Selection -->
      <div class="product-selection card">
        <div class="card-header">
          <h3>📦 Catalogue Produits</h3>
          <span class="badge">{{ filteredProducts.length }} produit{{ filteredProducts.length > 1 ? 's' : '' }}</span>
        </div>

        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par nom, matricule, description..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">✕</button>
        </div>

        <div class="table-container">
          <table v-if="filteredProducts.length" class="product-table">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom du Produit</th>
                <th class="text-right">Prix</th>
                <th class="text-center">Stock</th>
                <th class="text-center">Quantité</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in filteredProducts" :key="product.id" class="product-row">
                <td>
                  <span class="matricule-badge">{{ product.matricule || '—' }}</span>
                </td>
                <td class="product-name">{{ product.name }}</td>
                <td class="text-right price">{{ Number(product.price || 0).toFixed(2) }} DA</td>
                <td class="text-center" :class="{ 'low-stock': product.quantite < 10 }">
                  <span class="stock-badge" :class="{ 'warning': product.quantite < 10 }">
                    {{ product.quantite }}
                  </span>
                </td>
                <td class="text-center">
                  <input
                    type="number"
                    min="1"
                    :max="product.quantite"
                    v-model.number="addQuantities[product.id]"
                    class="qty-input"
                    placeholder="0"
                  />
                </td>
                <td class="text-center">
                  <button
                    @click="addToCart(product)"
                    :disabled="!addQuantities[product.id] || addQuantities[product.id] > product.quantite"
                    class="btn btn-add"
                  >
                    <span class="btn-icon">+</span> Ajouter
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="empty-state">
            <span class="empty-icon">📭</span>
            <p>Aucun produit trouvé</p>
            <small v-if="searchQuery">Essayez une autre recherche</small>
          </div>
        </div>
      </div>

      <!-- Cart / Selected Products -->
      <div class="cart-section card" :class="{ 'has-items': cart.length }">
        <div class="card-header">
          <h3>🛒 Panier</h3>
          <span class="badge badge-primary" v-if="cart.length">{{ cart.length }}</span>
        </div>

        <div v-if="cart.length" class="cart-content">
          <div class="table-container">
            <table class="selected-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th class="text-center">Quantité</th>
                  <th class="text-right">Prix Unitaire</th>
                  <th class="text-right">Sous-total</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in cart" :key="index" class="cart-item">
                  <td>
                    <div class="product-info">
                      <strong>{{ item.product_name }}</strong>
                      <small class="matricule-tag">{{ item.matricule }}</small>
                    </div>
                  </td>
                  <td class="text-center">
                    <input
                      type="number"
                      v-model.number="item.quantite"
                      min="1"
                      :max="item.maxStock"
                      @change="updateQuantity(index)"
                      class="qty-input-cart"
                    />
                  </td>
                  <td class="text-right price">{{ item.prix_vente.toFixed(2) }} DA</td>
                  <td class="text-right subtotal">{{ (item.quantite * item.prix_vente).toFixed(2) }} DA</td>
                  <td class="text-center">
                    <button @click="removeFromCart(index)" class="btn btn-remove" title="Retirer">
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="cart-footer">
            <div class="total-section">
              <span class="total-label">Total Facture</span>
              <span class="total-amount">{{ totalAmount.toFixed(2) }} DA</span>
            </div>

            <button
              @click="submitFacture"
              :disabled="loading || !cart.length"
              class="btn btn-submit"
            >
              <span class="btn-icon">📄</span>
              Valider & Générer Facture PDF
            </button>
          </div>
        </div>

        <div v-else class="empty-state">
          <span class="empty-icon">🛒</span>
          <p>Votre panier est vide</p>
          <small>Ajoutez des produits pour créer une facture</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/axios'
import jsPDF from 'jspdf'

const router = useRouter()

const products = ref([])
const cart = ref([])
const addQuantities = ref({})
const searchQuery = ref('')

const loading = ref(false)
const error = ref('')

// ========== TOKEN VERIFICATION ==========
const verifyVendeurToken = () => {
  console.log('🔍 Verifying VENDEUR token...') // ADD THIS

  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')

  console.log('Token:', token ? '✅ Exists' : '❌ Missing') // ADD THIS
  console.log('Role:', role) // ADD THIS
  console.log('Username:', username) // ADD THIS

  // Check if token exists
  if (!token || !role || !username) {
    console.log('❌ Token verification FAILED - missing data') // ADD THIS

    console.log('❌ Token verification FAILED - missing data') // ADD THIS
    alert('❌ Session expirée. Veuillez vous reconnecter.')
    localStorage.clear()
    router.push('/login')
    return false
  }

  // Check if user is VENDEUR
  if (role !== 'VENDEUR') {
    console.log('❌ Token verification FAILED - wrong role:', role) // ADD THIS

    alert('❌ Accès refusé : Cette action est réservée aux vendeurs.')
    router.push('/login')
    return false
  }

  console.log('✅ Token verification PASSED for VENDEUR') // ADD THIS
  return true
}

const fetchProducts = async () => {
  try {
    const { data } = await api.get('/api/products')
    products.value = data
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide ou expiré. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else {
      error.value = 'Erreur lors du chargement des produits'
      console.error(err)
    }
  }
}

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value

  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p =>
    p.name?.toLowerCase().includes(q) ||
    p.matricule?.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q)
  )
})

const addToCart = (product) => {
  const qty = Number(addQuantities.value[product.id])
  if (isNaN(qty) || qty < 1 || qty > product.quantite) {
    alert('⚠️ Quantité invalide ou supérieure au stock disponible')
    return
  }

  cart.value.push({
    product_name: product.name,
    matricule: product.matricule,
    quantite: qty,
    prix_vente: Number(product.price),
    maxStock: product.quantite
  })

  addQuantities.value[product.id] = null
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}

const updateQuantity = (index) => {
  const item = cart.value[index]
  if (item.quantite > item.maxStock) {
    item.quantite = item.maxStock
    alert(`⚠️ La quantité ne peut dépasser le stock disponible (${item.maxStock})`)
  }
  if (item.quantite < 1) item.quantite = 1
}

const totalAmount = computed(() =>
  cart.value.reduce((sum, item) => sum + (item.quantite * item.prix_vente), 0)
)

const submitFacture = async () => {
  // Verify vendeur token before submitting facture
  if (!verifyVendeurToken()) return

  if (!cart.value.length) return

  const payload = {
    date_creation: new Date().toISOString().split('T')[0],
    name_vendeur: localStorage.getItem('username') || 'Vendeur Inconnu',
    produits: cart.value.map(item => ({
      product_name: item.product_name,
      matricule: item.matricule,
      quantite: item.quantite,
      prix_vente: item.prix_vente
    }))
  }

  try {
    loading.value = true
    error.value = ''

    const response = await api.post('/api/factures', payload)

    generatePDF(response.data.facture_id || 'TEMP', payload)

    alert(`✅ Facture créée avec succès !\nID: ${response.data.facture_id || '—'}\nTotal: ${totalAmount.value.toFixed(2)} DA`)
    
    cart.value = []
    router.push('/vendeur/products')
  } catch (err) {
    console.error('Facture error:', err)
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else {
      error.value = err.response?.data?.error || 'Erreur lors de la création de la facture'
    }
  } finally {
    loading.value = false
  }
}

const generatePDF = (id, payload) => {
  const doc = new jsPDF()
  let y = 25

  doc.setFontSize(20)
  doc.text('FACTURE', 105, y, { align: 'center' })
  y += 15

  doc.setFontSize(12)
  doc.text(`N° Facture: ${id}`, 20, y)
  doc.text(`Date: ${payload.date_creation}`, 20, y + 8)
  doc.text(`Vendeur: ${payload.name_vendeur}`, 20, y + 16)
  y += 30

  doc.setFontSize(13)
  doc.text('Désignation', 20, y)
  doc.text('Qté', 90, y)
  doc.text('P.U.', 120, y)
  doc.text('Total', 170, y)
  y += 8
  doc.line(20, y, 190, y)
  y += 10

  payload.produits.forEach((p, i) => {
    doc.text(`${i+1}. ${p.product_name}`, 20, y)
    doc.text(`${i+1}. ${p.product_name} (${p.matricule})`, 20, y)
    doc.text(p.quantite.toString(), 95, y)
    doc.text(p.prix_vente.toFixed(2), 125, y)
    doc.text((p.quantite * p.prix_vente).toFixed(2), 175, y)
    y += 10
  })

  doc.setLineWidth(0.5)
  doc.line(20, y, 190, y)
  y += 12

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`TOTAL TTC : ${totalAmount.value.toFixed(2)} DA`, 170, y, { align: 'right' })

  doc.save(`facture_${id}_${new Date().toISOString().slice(0,10)}.pdf`)
}

onMounted(() => {
  // Verify token when component loads
  if (!verifyVendeurToken()) return
  fetchProducts()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.facture-creation {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
}

/* Alerts */
.alert {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.alert-info {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #90caf9;
}

.alert-error {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ef9a9a;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #1976d2;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Main Content Layout */
.main-content {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

/* Cards */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.badge {
  background: rgba(255,255,255,0.25);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-primary {
  background: #e74c3c;
  color: white;
}

/* Search Box */
.search-box {
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.search-icon {
  font-size: 1.25rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}

.clear-btn {
  background: #e9ecef;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #dee2e6;
}

/* Tables */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #dee2e6;
}

.product-row {
  transition: background 0.2s;
}

.product-row:hover {
  background: #f8f9fa;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.text-center { text-align: center; }
.text-right { text-align: right; }

.matricule-badge {
  background: #e9ecef;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #495057;
}

.product-name {
  font-weight: 500;
  color: #2c3e50;
}

.price {
  font-weight: 600;
  color: #27ae60;
}

.stock-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: #d4edda;
  color: #155724;
  font-weight: 600;
  font-size: 0.875rem;
}

.stock-badge.warning {
  background: #fff3cd;
  color: #856404;
}

/* Inputs */
.qty-input,
.qty-input-cart {
  width: 70px;
  padding: 0.5rem;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  text-align: center;
  font-size: 1rem;
  transition: all 0.3s;
}

.qty-input:focus,
.qty-input-cart:focus {
  outline: none;
  border-color: #667eea;
}

.qty-input-cart {
  width: 80px;
}

/* Buttons */
.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-add {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-add:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102,126,234,0.4);
}

.btn-remove {
  background: #fff;
  border: 1px solid #e9ecef;
  padding: 0.5rem;
  font-size: 1.25rem;
}

.btn-remove:hover {
  background: #fee;
  border-color: #e74c3c;
}

.btn-submit {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(17,153,142,0.4);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Cart Section */
.cart-section.has-items {
  position: sticky;
  top: 2rem;
}

.cart-content {
  padding: 1.5rem;
}

.cart-item td {
  padding: 1.25rem 1rem;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.matricule-tag {
  color: #6c757d;
  font-size: 0.8rem;
}

.subtotal {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.05rem;
}

.cart-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e9ecef;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.total-label {
  font-size: 1.25rem;
  font-weight: 600;
  color: #495057;
}

.total-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: #27ae60;
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: #495057;
}

.empty-state small {
  color: #6c757d;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>