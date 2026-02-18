<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar Admin -->
    <nav class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-2xl">👑</span>
            <h1 class="text-xl font-bold">Administration</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="flex items-center bg-blue-700 px-3 py-1 rounded-full">
              <span class="mr-2">{{ userAvatar }}</span>
              <span class="text-sm">{{ userName }}</span>
            </div>
            <button 
              @click="logout"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition flex items-center"
            >
              <span class="mr-2">🚪</span>
              Déconnexion
            </button>
          </div>
        </div>
        
        <!-- Menu Admin -->
        <div class="mt-4 flex flex-wrap gap-2">
        <!-- Dans src/layouts/AdminLayout.vue, modifier le RouterLink du dashboard -->
<RouterLink 
  to="/admin" 
  class="px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
  active-class="bg-blue-800 shadow-inner"
>
  <span class="mr-2">📊</span>
  Dashboard
</RouterLink>
<!-- Ce lien pointe maintenant vers AdminDashboard.vue -->
          <RouterLink 
            to="/admin/produits" 
            class="px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
            active-class="bg-blue-800 shadow-inner"
          >
            <span class="mr-2">📦</span>
            Produits
          </RouterLink>
          <RouterLink 
            to="/admin/utilisateurs" 
            class="px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
            active-class="bg-blue-800 shadow-inner"
          >
            <span class="mr-2">👥</span>
            Utilisateurs
          </RouterLink>
        </div>
      </div>
    </nav>
    
    <!-- Contenu -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-4 mt-8">
      <div class="container mx-auto px-4 text-center">
        <p class="text-sm">© 2024 Gestion Boutique • 
          <span class="inline-flex items-center">
            <span class="mr-1">👑</span>
            Panneau Administrateur
          </span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const router = useRouter()
const userStore = useUserStore()

// Utilise le userStore pour obtenir l'utilisateur connecté
const currentUser = computed(() => userStore.currentUser)

const userName = computed(() => {
  // Essaie d'abord le store, puis localStorage comme fallback
  return currentUser.value?.nom || localStorage.getItem('userName') || 'Administrateur'
})

const userAvatar = computed(() => {
  // Détermine l'avatar selon le rôle
  const role = currentUser.value?.role || localStorage.getItem('userRole')
  switch (role) {
    case 'admin': return '👑'
    case 'vendeur': return '💼'
    case 'gestionnaire_stock': return '📦'
    default: return '👤'
  }
})

function logout() {
  // Utilise le store pour la déconnexion
  userStore.logout()
  
  // Nettoie aussi localStorage pour le router
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userName')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userAvatar')
  localStorage.removeItem('rememberMe')
  localStorage.removeItem('rememberedEmail')
  
  router.push('/')
}
</script>