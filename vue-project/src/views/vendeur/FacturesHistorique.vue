<template>
  <div class="factures-historique">
    <h1>Historique des Factures</h1>

    <div v-if="loading" class="status loading">Chargement de l'historique...</div>
    <div v-if="error" class="status error">{{ error }}</div>

    <div v-if="factures.length === 0 && !loading" class="empty">
      Vous n'avez pas encore généré de factures.
    </div>

    <table v-if="factures.length" class="factures-table">
      <thead>
        <tr>
          <th>N° Facture</th>
          <th>Date</th>
          <th>Nombre de produits</th>
          <th>Total</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="facture in factures" :key="facture.id">
          <td>#{{ facture.id }}</td>
          <td>{{ formatDate(facture.date_creation) }}</td>
          <td>{{ facture.produits?.length || 0 }}</td>
          <td class="total-cell">{{ parseFloat(facture.totale_vente).toFixed(2) }} DA</td>
          <td>
            <button 
              @click="generatePDF(facture)" 
              class="btn btn-pdf"
              :disabled="loadingPDF"
            >
              {{ loadingPDF ? 'Génération...' : 'Télécharger PDF' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/axios'
import jsPDF from 'jspdf'

const router = useRouter()

const factures = ref([])
const loading = ref(false)
const loadingPDF = ref(false)
const error = ref('')

// ========== TOKEN VERIFICATION ==========
const verifyVendeurToken = () => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')

  // Check if token exists
  if (!token || !role || !username) {
    alert('❌ Session expirée. Veuillez vous reconnecter.')
    localStorage.clear()
    router.push('/login')
    return false
  }

  // Check if user is VENDEUR
  if (role !== 'VENDEUR') {
    alert('❌ Accès refusé : Cette action est réservée aux vendeurs.')
    router.push('/login')
    return false
  }

  return true
}

// Fetch vendeur's factures
const fetchFactures = async () => {
  if (!verifyVendeurToken()) return

  try {
    loading.value = true
    const vendeurName = localStorage.getItem('username') || 'Vendeur'
    
    const { data } = await api.get(`/api/factures/name/${encodeURIComponent(vendeurName)}`)
    
    factures.value = data
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide ou expiré. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else {
      error.value = 'Impossible de charger l\'historique des factures'
      console.error(err)
    }
  } finally {
    loading.value = false
  }
}

// Format date nicely
const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) : '-'
}

// Regenerate PDF from existing facture data
const generatePDF = async (facture) => {
  // Verify vendeur token before generating PDF
  if (!verifyVendeurToken()) return

  try {
    loadingPDF.value = true
    
    // Fetch full facture details with products if not already loaded
    let factureWithProducts = facture
    
    if (!facture.produits || facture.produits.length === 0) {
      const { data } = await api.get(`/api/factures/${facture.id}/produits`)
      factureWithProducts = { ...facture, produits: data }
    }
    
    // Generate PDF
    const doc = new jsPDF()
    let y = 25

    doc.setFontSize(20)
    doc.text(`FACTURE #${factureWithProducts.id}`, 105, y, { align: 'center' })
    y += 15

    doc.setFontSize(12)
    doc.text(`Date: ${formatDate(factureWithProducts.date_creation)}`, 20, y)
    doc.text(`Vendeur: ${factureWithProducts.name_vendeur}`, 20, y + 8)
    y += 25

    doc.setFontSize(13)
    doc.text('Désignation', 20, y)
    doc.text('Qté', 90, y)
    doc.text('P.U.', 120, y)
    doc.text('Total', 170, y)
    y += 8
    doc.line(20, y, 190, y)
    y += 10

    // Add products
    if (factureWithProducts.produits && factureWithProducts.produits.length > 0) {
      factureWithProducts.produits.forEach((p, i) => {
        doc.text(`${i+1}. ${p.product_name} (${p.matricule})`, 20, y)
        doc.text(p.quantite.toString(), 95, y)
        doc.text(parseFloat(p.prix_vente).toFixed(2), 125, y)
        doc.text((p.quantite * p.prix_vente).toFixed(2), 175, y)
        y += 10
      })
    }

    doc.line(20, y, 190, y)
    y += 12

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`TOTAL TTC : ${parseFloat(factureWithProducts.totale_vente).toFixed(2)} DA`, 170, y, { align: 'right' })

    doc.save(`facture_${factureWithProducts.id}_${factureWithProducts.date_creation}.pdf`)
  } catch (err) {
    console.error('Error generating PDF:', err)
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else {
      alert('⚠️ Erreur lors de la génération du PDF')
    }
  } finally {
    loadingPDF.value = false
  }
}

onMounted(fetchFactures)
</script>

<style scoped>
.factures-historique {
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.factures-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

th, td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

tr:hover {
  background: #f8f9fa;
}

.total-cell {
  font-weight: bold;
  color: #27ae60;
  font-size: 1.05rem;
}

.btn-pdf {
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-pdf:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142,68,173,0.4);
}

.btn-pdf:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status.loading {
  color: #3498db;
  font-weight: 500;
  text-align: center;
  padding: 2rem;
}

.status.error {
  color: #e74c3c;
  font-weight: 500;
  text-align: center;
  padding: 2rem;
  background: #ffebee;
  border-radius: 8px;
}

.empty {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
  font-style: italic;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
</style>