<template>
  <div class="reclamations-admin">
    <h1>Gestion des Réclamations</h1>

    <div v-if="loading" class="status">Chargement...</div>
    <div v-if="error" class="status error">{{ error }}</div>

    <div class="filters">
      <select v-model="filterRole">
        <option value="">Tous les rôles</option>
        <option value="VENDEUR">Vendeurs</option>
        <option value="GESTIONNAIRE_STOCK">Gestionnaires Stock</option>
      </select>
    </div>

    <table v-if="filteredReclamations.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Utilisateur</th>
          <th>Rôle</th>
          <th>Type</th>
          <th>Description</th>
          <th>Date</th>
          <th>État</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rec in filteredReclamations" :key="rec.id">
          <td>{{ rec.id }}</td>
          <td>{{ rec.nomUser }} ({{ rec.matricule }})</td>
          <td>{{ rec.role }}</td>
          <td>{{ rec.typeReclamation?.typeReclamation || '-' }}</td>
          <td>{{ rec.description.substring(0, 60) }}...</td>
          <td>{{ formatDate(rec.dateReclamation) }}</td>
          <td>
            <span :class="`status-badge ${rec.etat.toLowerCase()}`">
              {{ rec.etat }}
            </span>
          </td>
          <td>
            <button
              v-if="rec.etat === 'NON_VALIDE'"
              @click="changeStatus(rec.id, 'TRAITEE')"
              class="btn btn-traiter"
            >
              Marquer comme traitée
            </button>
            <span v-else class="text-muted">Déjà traitée</span>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">Aucune réclamation pour le moment</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/utils/axios'

const reclamations = ref([])
const loading = ref(false)
const error = ref('')
const filterRole = ref('')

const fetchReclamations = async () => {
  try {
    loading.value = true
    const { data } = await api.get('/reclamations')
    reclamations.value = data
  } catch (err) {
    error.value = 'Erreur chargement réclamations'
  } finally {
    loading.value = false
  }
}

const changeStatus = async (id, newEtat) => {
  if (!confirm('Confirmer le changement d\'état ?')) return

  try {
    await api.put(`/reclamations/${id}/etat`, { etat: newEtat })
    await fetchReclamations()
    alert('État mis à jour avec succès')
  } catch (err) {
    error.value = 'Erreur changement état'
  }
}

const filteredReclamations = computed(() => {
  if (!filterRole.value) return reclamations.value
  return reclamations.value.filter(r => r.role === filterRole.value)
})

const formatDate = (date) => date ? new Date(date).toLocaleString('fr-FR') : '-'

onMounted(fetchReclamations)
</script>

<style scoped>
.reclamations-admin { padding: 24px; }
.filters { margin-bottom: 24px; }
select { padding: 10px; border-radius: 6px; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px; border-bottom: 1px solid #eee; }
.status-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
}
.status-badge.non_valide { background: #f1c40f; color: white; }
.status-badge.traitee { background: #27ae60; color: white; }
.btn-traiter { background: #3498db; color: white; border: none; padding: 6px 12px; border-radius: 4px; }
.empty { text-align: center; color: #777; padding: 40px; }
</style>