<!-- src/layouts/StockLayout.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar Stock -->
    <nav class="bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <span class="text-2xl">📦</span>
            <h1 class="text-xl font-bold">Gestion Stock</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm opacity-90">{{ userName }}</span>
            <button 
              @click="logout"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
        
        <!-- Menu Stock -->
        <div class="mt-4 flex space-x-4">
          <RouterLink 
            to="/stock" 
            class="px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
            active-class="bg-yellow-800"
          >
            Dashboard
          </RouterLink>
          <RouterLink 
            to="/stock/produits" 
            class="px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
            active-class="bg-yellow-800"
          >
            Produits
          </RouterLink>
        </div>
      </div>
    </nav>
    
    <!-- Contenu -->
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userName = computed(() => localStorage.getItem('userName') || 'Gestionnaire')

function logout() {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userName')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userEmail')
  router.push('/')
}
</script>