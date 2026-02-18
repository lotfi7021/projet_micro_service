<template>
  <div class="users-management">
    <h1>Gestion des Utilisateurs</h1>

    <!-- Loading & Error -->
    <div v-if="loading" class="status-message">Chargement...</div>
    <div v-if="error" class="status-message error">{{ error }}</div>

    <!-- CREATE FORM -->
    <div class="create-section">
      <h3>Ajouter un utilisateur</h3>
      <form @submit.prevent="createUser" class="user-form">
        <input v-model="newUser.firstname" placeholder="Prénom" required />
        <input v-model="newUser.lastname" placeholder="Nom" required />
        <input v-model="newUser.username" placeholder="Nom d'utilisateur" required />
        <input v-model="newUser.mail" type="email" placeholder="Email" required />
        <input v-model="newUser.matriculeUser" placeholder="Matricule" required />
        <input v-model="newUser.password" type="password" placeholder="Mot de passe" required />
        <input v-model="newUser.dateDebut" type="date" placeholder="Date début" />

        <select v-model="selectedRole" required>
          <option value="" disabled>Rôle</option>
          <option value="ADMIN">Admin</option>
          <option value="GESTIONNAIRE_STOCK">Gestionnaire Stock</option>
          <option value="VENDEUR">Vendeur</option>
        </select>

        <button type="submit" :disabled="loading">Créer</button>
      </form>
    </div>

    <!-- USERS LIST -->
    <div class="users-list">
      <h3>Liste des utilisateurs</h3>

      <table v-if="users.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Username</th>
            <th>Email</th>
            <th>Matricule</th>
            <th>Rôle</th>
            <th>Date début</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <input v-if="editingId === user.id" v-model="editForm.firstname" />
              <span v-else>{{ user.firstname }}</span>
            </td>
            <td>
              <input v-if="editingId === user.id" v-model="editForm.lastname" />
              <span v-else>{{ user.lastname }}</span>
            </td>
            <td>
              <input v-if="editingId === user.id" v-model="editForm.username" />
              <span v-else>{{ user.username }}</span>
            </td>
            <td>
              <input v-if="editingId === user.id" v-model="editForm.mail" type="email" />
              <span v-else>{{ user.mail }}</span>
            </td>
            <td>
              <input v-if="editingId === user.id" v-model="editForm.matriculeUser" />
              <span v-else>{{ user.matriculeUser }}</span>
            </td>
            <td>
              <select v-if="editingId === user.id" v-model="editForm.role">
                <option value="ADMIN">Admin</option>
                <option value="GESTIONNAIRE_STOCK">Gestionnaire Stock</option>
                <option value="VENDEUR">Vendeur</option>
              </select>
              <span v-else>{{ user.role }}</span>
            </td>
            <td>
              <input v-if="editingId === user.id" v-model="editForm.dateDebut" type="date" />
              <span v-else>{{ formatDate(user.dateDebut) }}</span>
            </td>
            <td class="actions">
              <button v-if="editingId === user.id" @click="saveEdit(user.id)" class="save">Enregistrer</button>
              <button v-if="editingId === user.id" @click="cancelEdit" class="cancel">Annuler</button>

              <button v-else @click="startEdit(user)" class="edit">Modifier</button>
              <button @click="deleteUser(user.id)" class="delete">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>Aucun utilisateur trouvé</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/axios'

const router = useRouter()

const users = ref([])
const loading = ref(false)
const error = ref('')

// Create form
const newUser = ref({
  firstname: '',
  lastname: '',
  username: '',
  mail: '',
  matriculeUser: '',
  password: '',
  dateDebut: ''
})
const selectedRole = ref('')

// Edit form
const editingId = ref(null)
const editForm = ref({})

// ========== TOKEN VERIFICATION ==========
const verifyAdminToken = () => {
console.log('🔍 Verifying ADMIN token...') // ADD THIS
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

  // Check if user is ADMIN
  if (role !== 'ADMIN') {
      console.log('❌ Token verification FAILED - wrong role:', role) // ADD THIS

    alert('❌ Accès refusé : Cette action est réservée aux administrateurs.')
    router.push('/login')
    return false
  }

    console.log('✅ Token verification PASSED for ADMIN') // ADD THIS

  return true
}

// Fetch all users
const fetchUsers = async () => {
  if (!verifyAdminToken()) return

  try {
    loading.value = true
    const response = await api.get('/users')
    users.value = response.data
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide ou expiré. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else {
      error.value = 'Erreur lors du chargement des utilisateurs'
      console.error(err)
    }
  } finally {
    loading.value = false
  }
}

// CREATE
const createUser = async () => {
  // Verify admin token before creating
  if (!verifyAdminToken()) return

  try {
    loading.value = true
    error.value = ''

    // Validation
    if (!newUser.value.firstname || !newUser.value.lastname || 
        !newUser.value.username || !newUser.value.mail || 
        !newUser.value.matriculeUser || !newUser.value.password || 
        !selectedRole.value) {
      throw new Error('Veuillez remplir tous les champs obligatoires')
    }

    // Prepare payload
    const payload = {
      firstname: newUser.value.firstname.trim(),
      lastname: newUser.value.lastname.trim(),
      username: newUser.value.username.trim(),
      mail: newUser.value.mail.trim(),
      matriculeUser: newUser.value.matriculeUser.trim(),
      password: newUser.value.password,
      dateDebut: newUser.value.dateDebut || null
    }

    await api.post('/users', payload, {
      params: {
        role: selectedRole.value
      }
    })

    alert('✅ Utilisateur créé avec succès !')

    // Reset form
    newUser.value = {
      firstname: '',
      lastname: '',
      username: '',
      mail: '',
      matriculeUser: '',
      password: '',
      dateDebut: ''
    }
    selectedRole.value = ''

    await fetchUsers()

  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else if (err.response) {
      const backendMsg = err.response.data?.message || err.response.data?.error
      
      if (backendMsg?.includes('unique constraint') || backendMsg?.includes('already exists')) {
        error.value = 'Cette valeur (username, email ou matricule) existe déjà'
      } else if (backendMsg) {
        error.value = backendMsg
      } else {
        error.value = 'Erreur serveur lors de la création'
      }
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'Erreur inattendue lors de la création'
    }
    
    console.error('Create user error:', err)
  } finally {
    loading.value = false
  }
}

// UPDATE
const startEdit = (user) => {
  if (!verifyAdminToken()) return

  editingId.value = user.id
  editForm.value = {
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    username: user.username || '',
    mail: user.mail || '',
    matriculeUser: user.matriculeUser || '',
    role: user.role || '',
    dateDebut: user.dateDebut ? formatDateForInput(user.dateDebut) : ''
  }
}

const saveEdit = async (id) => {
  if (!verifyAdminToken()) return

  try {
    if (!editForm.value.firstname || !editForm.value.lastname || !editForm.value.username || !editForm.value.mail || !editForm.value.matriculeUser || !editForm.value.role) {
      error.value = 'Tous les champs obligatoires doivent être remplis'
      return
    }
    
    await api.put(`/users/${id}`, editForm.value)
    await fetchUsers()
    cancelEdit()
    alert('✅ Utilisateur modifié avec succès')
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      alert('❌ Token invalide. Reconnectez-vous.')
      localStorage.clear()
      router.push('/login')
    } else {
      error.value = err.response?.data?.message || 'Erreur lors de la modification'
      console.error(err)
    }
  }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = {}
}

// DELETE
const deleteUser = async (id) => {
  if (!verifyAdminToken()) return

  if (!confirm('⚠️ Vraiment supprimer cet utilisateur ?')) return

  try {
    await api.delete(`/users/${id}`)
    users.value = users.value.filter(u => u.id !== id)
    alert('✅ Utilisateur supprimé avec succès')
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

// Helpers
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatDateForInput = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

// Load on mount
onMounted(fetchUsers)
</script>

<style scoped>
.users-management {
  padding: 30px;
}

.user-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 20px 0 40px;
}

.user-form input,
.user-form select,
.user-form button {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.user-form button {
  background: #27ae60;
  color: white;
  border: none;
  cursor: pointer;
}

.user-form button:hover {
  background: #229954;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
}

td input,
td select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.actions button {
  margin-right: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit    { background: #3498db; color: white; }
.save    { background: #27ae60; color: white; }
.cancel  { background: #95a5a6; color: white; }
.delete  { background: #e74c3c; color: white; }

.edit:hover    { background: #2980b9; }
.save:hover    { background: #229954; }
.cancel:hover  { background: #7f8c8d; }
.delete:hover  { background: #c0392b; }

.status-message {
  padding: 12px;
  margin: 20px 0;
  border-radius: 6px;
}

.error {
  background: #ffebee;
  color: #c0392b;
}
</style>