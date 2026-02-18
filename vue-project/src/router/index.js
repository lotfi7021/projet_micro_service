import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue')
    // No meta requiredAuth here - login is public
  },

  // Admin Dashboard
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' }
  },

  {
  path: '/admin/users',
  name: 'users-management',
  component: () => import('../views/admin/UsersManagement.vue'),
  meta: { requiresAuth: true, role: 'ADMIN' }
  },

  // Pour Admin
{
  path: '/admin/products',
  name: 'admin-products',
  component: () => import('../views/products/ProductsManagement.vue'),
  meta: { requiresAuth: true, role: 'ADMIN' }
},

{
  path: '/admin/historique',
  name: 'admin-historique',
  component: () => import('../views/admin/HistoriqueActions.vue'),
  meta: { requiresAuth: true, role: 'ADMIN' }
},

// Pour Gestionnaire Stock
{
  path: '/stock/products',
  name: 'stock-products',
  component: () => import('../views/products/ProductsManagement.vue'),
  meta: { requiresAuth: true, role: 'GESTIONNAIRE_STOCK' }
},

{
  path: '/admin/product-types',
  name: 'admin-product-types',
  component: () => import('../views/admin/ProductTypesManagement.vue'),
  meta: { requiresAuth: true, role: 'ADMIN' }
},

{
  path: '/admin/product-locations',
  name: 'admin-product-locations',
  component: () => import('../views/admin/ProductLocationsManagement.vue'),
  meta: { requiresAuth: true, role: 'ADMIN' }
},

  // Vendeur Dashboard
  {
    path: '/vendeur',
    name: 'vendeur-dashboard',
    component: () => import('../views/VendeurDashboard.vue'),
    meta: { requiresAuth: true, role: 'VENDEUR' }
  },

  {
  path: '/vendeur/products',
  name: 'vendeur-products',
  component: () => import('../views/vendeur/ProductsList.vue'),
  meta: { requiresAuth: true, role: 'VENDEUR' }
},

{
  path: '/vendeur/factures/create',
  name: 'vendeur-facture-create',
  component: () => import('../views/vendeur/FactureCreation.vue'),
  meta: { requiresAuth: true, role: 'VENDEUR' }
},

{
  path: '/vendeur/factures/historique',
  name: 'vendeur-factures-historique',
  component: () => import('../views/vendeur/FacturesHistorique.vue'),
  meta: { requiresAuth: true, role: 'VENDEUR' }
},


{
  path: '/reclamation/create',
  name: 'reclamation-create',
  component: () => import('../views/ReclamationCreate.vue'),
  meta: { requiresAuth: true }
},

// Vendeur
{ path: '/vendeur/reclamations/create', component: () => import('../views/ReclamationCreate.vue'), meta: { requiresAuth: true, role: 'VENDEUR' } },

// Stock
{ path: '/stock/reclamations/create', component: () => import('../views/ReclamationCreate.vue'), meta: { requiresAuth: true, role: 'GESTIONNAIRE_STOCK' } },

// Admin
{ path: '/admin/reclamations', component: () => import('../views/admin/ReclamationsManagement.vue'), meta: { requiresAuth: true, role: 'ADMIN' } },

  // Gestionnaire de Stock Dashboard
  {
    path: '/stock',
    name: 'stock-dashboard',
    component: () => import('../views/StockDashboard.vue'),
    meta: { requiresAuth: true, role: 'GESTIONNAIRE_STOCK' }
  },

  // 404 - Catch-all
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: {
      template: `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center p-8">
            <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-8">Page non trouvée</p>
            <router-link 
              to="/" 
              class="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retour à la connexion
            </router-link>
          </div>
        </div>
      `
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // If user is trying to access login while already authenticated
  if (to.path === '/' && token && role) {
    switch (role) {
      case 'ADMIN':
        return next('/admin')
      case 'GESTIONNAIRE_STOCK':
        return next('/stock')
      case 'VENDEUR':
        return next('/vendeur')
      default:
        return next('/')
    }
  }

  // Protected routes
  if (to.meta.requiresAuth) {
    if (!token) {
      // Not authenticated → go to login
      return next('/')
    }

    // Role check
    if (to.meta.role && role !== to.meta.role) {
      // Wrong role → redirect to correct dashboard
      switch (role) {
        case 'ADMIN':
          return next('/admin')
        case 'GESTIONNAIRE_STOCK':
          return next('/stock')
        case 'VENDEUR':
          return next('/vendeur')
        default:
          return next('/')
      }
    }

    // All good
    return next()
  }

  // Public route (login)
  next()
})

export default router