<template>
  <div class="historique-actions">
    <h1>Historique des Actions sur les Produits</h1>

    <div v-if="loading" class="status loading">Chargement de l'historique...</div>
    <div v-if="error" class="status error">{{ error }}</div>

    <!-- Filters -->
    <div class="filters card" v-if="!loading && !error">
      <div class="filter-group">
        <label>Gestionnaire</label>
        <input 
          v-model="filter.gestionnaire" 
          placeholder="Nom du gestionnaire (ex: admin, stock1)..." 
          class="filter-input" 
        />
      </div>

      <div class="filter-group">
        <label>Type d'action</label>
        <select v-model="filter.actionType">
          <option value="">Tous</option>
          <option value="ADD_PRODUCT">Ajout produit</option>
          <option value="UPDATE_PRODUCT">Modification produit</option>
          <option value="UPDATE_PRODUCT_QUANTITY">Changement quantité</option>
          <option value="DELETE_PRODUCT">Suppression produit</option>
        </select>
      </div>

      <div class="filter-group date-group">
        <label>Période</label>
        <input type="date" v-model="filter.startDate" />
        <input type="date" v-model="filter.endDate" />
      </div>

      <button @click="applyFilters" class="btn btn-filter">Filtrer</button>
      <button @click="resetFilters" class="btn btn-reset">Tout afficher</button>
    </div>

    <!-- Table -->
    <div v-if="filteredHistorique.length && !loading && !error" class="table-container card">
      <div class="results-info">
        {{ filteredHistorique.length }} action{{ filteredHistorique.length > 1 ? 's' : '' }} trouvée{{ filteredHistorique.length > 1 ? 's' : '' }}
      </div>
      <table class="historique-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Gestionnaire</th>
            <th>Action</th>
            <th>Produit (Matricule)</th>
            <th>Nom produit</th>
            <th>Qté Avant</th>
            <th>Qté Après</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="action in filteredHistorique" :key="action.id">
            <td>{{ formatDate(action.created_at) }}</td>
            <td class="gestionnaire-cell">
              <strong>{{ action.gestionnaire_username || 'Système' }}</strong>
            </td>
            <td>
              <span class="action-badge" :class="getActionClass(action.action_type)">
                {{ formatActionType(action.action_type) }}
              </span>
            </td>
            <td>{{ action.product_matricule || '-' }}</td>
            <td>{{ action.product_name || '-' }}</td>
            <td>{{ action.quantite_avant ?? '-' }}</td>
            <td>{{ action.quantite_apres ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else-if="!loading && !error" class="empty">
      {{ filterHasValues ? 'Aucune action trouvée avec les filtres actuels' : 'Aucune action enregistrée pour le moment' }}
      <br><small v-if="!filterHasValues">Créez/Modifiez des produits pour voir l'historique</small>
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/utils/axios'

const allHistorique = ref([])      // Raw data from API
const loading = ref(false)
const error = ref('')

const filter = ref({
  gestionnaire: '',
  actionType: '',
  startDate: '',
  endDate: ''
})

const filterHasValues = computed(() =>
  !!filter.value.gestionnaire || !!filter.value.actionType ||
  !!filter.value.startDate || !!filter.value.endDate
)

// CLIENT-SIDE FILTERING (since backend doesn't support all filters)
const filteredHistorique = computed(() => {
  let result = allHistorique.value

  // Filter by gestionnaire_username (the field that exists in DB)
  if (filter.value.gestionnaire) {
    const search = filter.value.gestionnaire.toLowerCase()
    result = result.filter(action =>
      action.gestionnaire_username?.toLowerCase().includes(search)
    )
  }

  // Filter by action_type
  if (filter.value.actionType) {
    result = result.filter(action => action.action_type === filter.value.actionType)
  }

  // Filter by date range
  if (filter.value.startDate && filter.value.endDate) {
    const start = new Date(filter.value.startDate)
    const end = new Date(filter.value.endDate)
    end.setHours(23, 59, 59) // Include full end day

    result = result.filter(action => {
      const actionDate = new Date(action.created_at)
      return actionDate >= start && actionDate <= end
    })
  }

  return result
})

// Fetch RAW data from backend (always get all/recent)
const fetchHistorique = async () => {
  try {
    loading.value = true
    error.value = ''

    // CORRECT URL from your gateway config
    const { data } = await api.get('/api/historique')

    // Safety checks
    allHistorique.value = Array.isArray(data) ? data : []
    console.log('Historique loaded:', allHistorique.value.length, 'actions')
  } catch (err) {
    console.error('Historique fetch error:', err)
    error.value = err.response?.status === 404 
      ? 'Route /api/historique non trouvée - vérifiez la gateway' 
      : err.response?.data?.error || 'Erreur serveur'
    allHistorique.value = []
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  // Filters are reactive - no need to call anything
  // filteredHistorique computed runs automatically
}

const resetFilters = () => {
  filter.value = { gestionnaire: '', actionType: '', startDate: '', endDate: '' }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatActionType = (type) => {
  const map = {
    'ADD_PRODUCT': 'Ajout produit',
    'UPDATE_PRODUCT': 'Modification produit',
    'UPDATE_PRODUCT_QUANTITY': 'Changement quantité',
    'DELETE_PRODUCT': 'Suppression produit'
  }
  return map[type] || type
}

const getActionClass = (type) => {
  const map = {
    'ADD_PRODUCT': 'add',
    'UPDATE_PRODUCT': 'update',
    'UPDATE_PRODUCT_QUANTITY': 'quantity',
    'DELETE_PRODUCT': 'delete'
  }
  return map[type] || ''
}

onMounted(() => {
  fetchHistorique()
})
</script>

<style scoped>
.historique-actions { padding: 24px; max-width: 1400px; margin: 0 auto; }
.filters { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 16px; 
  margin-bottom: 32px; 
  padding: 24px; 
  background: #f8f9fa; 
  border-radius: 8px; 
  border: 1px solid #e9ecef;
}
.filter-group { flex: 1; min-width: 180px; }
.filter-group label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 0.9rem; }
.filter-input, select, input[type="date"] { 
  width: 100%; 
  padding: 10px 12px; 
  border: 1px solid #ddd; 
  border-radius: 6px; 
  font-size: 1rem;
}
.filter-input:focus, select:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2); }
.date-group { display: flex; gap: 12px; align-items: flex-end; }
.date-group input { min-width: 140px; }

.btn { 
  padding: 11px 20px; 
  border: none; 
  border-radius: 6px; 
  cursor: pointer; 
  font-weight: 500; 
  font-size: 0.95rem;
  transition: all 0.2s;
}
.btn-filter { background: #3498db; color: white; }
.btn-filter:hover { background: #2980b9; }
.btn-reset { background: #95a5a6; color: white; margin-left: 8px; }
.btn-reset:hover { background: #7f8c8d; }

.results-info {
  padding: 12px 16px;
  background: #e8f5e8;
  border-radius: 6px;
  margin-bottom: 16px;
  font-weight: 500;
  color: #27ae60;
}

.historique-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
th, td { padding: 14px 12px; border-bottom: 1px solid #eee; text-align: left; }
th { 
  background: #f8f9fa; 
  font-weight: 600; 
  font-size: 0.9rem; 
  color: #495057;
  position: sticky; top: 0;
}
.gestionnaire-cell { font-family: monospace; }
.action-badge { 
  padding: 5px 12px; 
  border-radius: 20px; 
  font-size: 0.8rem; 
  font-weight: 600;
  text-transform: uppercase;
}
.action-badge.add { background: #27ae60; color: white; }
.action-badge.update { background: #f39c12; color: white; }
.action-badge.quantity { background: #8e44ad; color: white; }
.action-badge.delete { background: #e74c3c; color: white; }

.status { 
  padding: 16px; 
  margin: 20px 0; 
  border-radius: 8px; 
  text-align: center; 
  font-weight: 500;
}
.status.loading { background: #e3f2fd; color: #1976d2; }
.status.error { background: #ffebee; color: #c62828; }

.empty { 
  text-align: center; 
  padding: 80px 40px; 
  color: #6c757d; 
  font-style: italic; 
}
.empty small { color: #adb5bd; display: block; margin-top: 8px; }
</style>