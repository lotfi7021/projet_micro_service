<!-- src/layouts/VendeurLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar Vendeur -->
    <nav class="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-2xl">💼</span>
            <h1 class="text-xl font-bold">Espace Vendeur</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="flex items-center bg-green-700 px-3 py-1 rounded-full">
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
        
        <!-- Menu Vendeur -->
        <div class="mt-4 flex flex-wrap gap-2">
          <RouterLink 
            to="/vendeur" 
            class="px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
            active-class="bg-green-800 shadow-inner"
          >
            <span class="mr-2">📊</span>
            Dashboard
          </RouterLink>
          <RouterLink 
            to="/vendeur/ventes" 
            class="px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
            active-class="bg-green-800 shadow-inner"
          >
            <span class="mr-2">💰</span>
            Ventes
          </RouterLink>
          <RouterLink 
            to="/vendeur/produits" 
            class="px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
            active-class="bg-green-800 shadow-inner"
          >
          
            <span class="mr-2">📦</span>
            Produits
          </RouterLink>
          <RouterLink 
            to="/vendeur/clients" 
            class="px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
            active-class="bg-green-800 shadow-inner"
          >
            <span class="mr-2">👥</span>
            Clients
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
            <span class="mr-1">💼</span>
            Espace Vente
          </span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userName = computed(() => localStorage.getItem('userName') || 'Vendeur')
const userAvatar = computed(() => localStorage.getItem('userAvatar') || '👤')

function logout() {
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