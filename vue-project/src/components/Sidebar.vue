<template>
  <aside class="sidebar">
    <!-- Role Badge -->
    <div class="role-badge">
      <div class="role-icon">
        <svg v-if="role === 'ADMIN'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <svg v-else-if="role === 'GESTIONNAIRE_STOCK'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </div>
      <div class="role-info">
        <span class="role-label">Espace</span>
        <span class="role-name">{{ roleDisplay }}</span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in menuItems" :key="item.path">
          <router-link :to="item.path" active-class="active">
            <span class="nav-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <component :is="getIcon(item.label)" />
              </svg>
            </span>
            <span class="nav-label">{{ item.label }}</span>
            <span class="nav-indicator"></span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="version-info">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>Version 2.0.1</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, h } from 'vue'

const role = computed(() => localStorage.getItem('role'))

const roleDisplay = computed(() => {
  switch (role.value) {
    case 'ADMIN':
      return 'Administrateur'
    case 'GESTIONNAIRE_STOCK':
      return 'Gestionnaire'
    case 'VENDEUR':
      return 'Vendeur'
    default:
      return 'Utilisateur'
  }
})

const menuItems = computed(() => {
  if (role.value === 'ADMIN') {
    return [
      { path: '/admin', label: 'Tableau de bord' },
      { path: '/admin/users', label: 'Gestion Utilisateurs' },
      { path: '/admin/product-types', label: 'Gestion Types Produits' },
      { path: '/admin/product-locations', label: 'Gestion Emplacements' },
      { path: '/admin/products', label: 'Gestion Produits' },
      { path: '/admin/reclamations', label: 'Gestion Réclamations' },
      { path: '/admin/historique', label: 'Historique Actions' },
    ]
  }

  if (role.value === 'GESTIONNAIRE_STOCK') {
    return [
      { path: '/stock', label: 'Tableau de bord' },
      { path: '/stock/products', label: 'Gestion Produits' },
      { path: '/stock/reclamations/create', label: 'Envoyer Réclamation' },
    ]
  }

  if (role.value === 'VENDEUR') {
    return [
      { path: '/vendeur', label: 'Tableau de bord' },
      { path: '/vendeur/products', label: 'Liste des Produits' },
      { path: '/vendeur/factures/create', label: 'Créer Facture' },
      { path: '/vendeur/reclamations/create', label: 'Envoyer Réclamation' },
      { path: '/vendeur/factures/historique', label: 'Historique Factures' },
    ]
  }

  return [
    { path: '/', label: 'Retour à la connexion' }
  ]
})

const getIcon = (label) => {
  const icons = {
    'Tableau de bord': () => h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
    'Gestion Utilisateurs': () => [
      h('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '9', cy: '7', r: '4' }),
      h('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
    ],
    'Gestion Types Produits': () => [
      h('rect', { x: '3', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '3', width: '7', height: '7' }),
      h('rect', { x: '14', y: '14', width: '7', height: '7' }),
      h('rect', { x: '3', y: '14', width: '7', height: '7' })
    ],
    'Gestion Emplacements': () => [
      h('path', { d: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' }),
      h('circle', { cx: '12', cy: '10', r: '3' })
    ],
    'Gestion Produits': () => [
      h('path', { d: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' }),
      h('polyline', { points: '3.27 6.96 12 12.01 20.73 6.96' }),
      h('line', { x1: '12', y1: '22.08', x2: '12', y2: '12' })
    ],
    'Gestion Réclamations': () => [
      h('path', { d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' }),
      h('line', { x1: '12', y1: '9', x2: '12', y2: '13' }),
      h('line', { x1: '12', y1: '17', x2: '12.01', y2: '17' })
    ],
    'Historique Actions': () => [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ],
    'Liste des Produits': () => [
      h('line', { x1: '8', y1: '6', x2: '21', y2: '6' }),
      h('line', { x1: '8', y1: '12', x2: '21', y2: '12' }),
      h('line', { x1: '8', y1: '18', x2: '21', y2: '18' }),
      h('line', { x1: '3', y1: '6', x2: '3.01', y2: '6' }),
      h('line', { x1: '3', y1: '12', x2: '3.01', y2: '12' }),
      h('line', { x1: '3', y1: '18', x2: '3.01', y2: '18' })
    ],
    'Créer Facture': () => [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' }),
      h('line', { x1: '12', y1: '18', x2: '12', y2: '12' }),
      h('line', { x1: '9', y1: '15', x2: '15', y2: '15' })
    ],
    'Envoyer Réclamation': () => [
      h('path', { d: 'M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48' })
    ],
    'Historique Factures': () => [
      h('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
      h('polyline', { points: '14 2 14 8 20 8' }),
      h('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
      h('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
      h('polyline', { points: '10 9 9 9 8 9' })
    ],
    'Retour à la connexion': () => [
      h('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
      h('polyline', { points: '16 17 21 12 16 7' }),
      h('line', { x1: '21', y1: '12', x2: '9', y2: '12' })
    ]
  }
  
  return icons[label] || (() => h('circle', { cx: '12', cy: '12', r: '10' }))
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  height: calc(100vh - 60px);
  position: fixed;
  top: 60px;
  left: 0;
  overflow-y: auto;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

/* Custom Scrollbar */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Role Badge */
.role-badge {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 24px 20px;
  margin: 0 16px 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  border-left: 4px solid #1abc9c;
  margin-top: 20px;
}

.role-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(26, 188, 156, 0.3);
}

.role-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.role-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.role-name {
  font-size: 1rem;
  color: white;
  font-weight: 700;
  letter-spacing: 0.3px;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 0 12px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.sidebar-nav a::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: #1abc9c;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.sidebar-nav a:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(4px);
}

.sidebar-nav a:hover::before {
  transform: scaleY(1);
}

.sidebar-nav a.active {
  background: linear-gradient(90deg, rgba(26, 188, 156, 0.2) 0%, rgba(26, 188, 156, 0.05) 100%);
  color: #1abc9c;
  font-weight: 600;
  box-shadow: inset 0 0 0 1px rgba(26, 188, 156, 0.3);
}

.sidebar-nav a.active::before {
  transform: scaleY(1);
}

.sidebar-nav a.active .nav-indicator {
  opacity: 1;
  transform: scale(1);
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-indicator {
  width: 6px;
  height: 6px;
  background: #1abc9c;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 0 8px rgba(26, 188, 156, 0.6);
}

/* Footer */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.version-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  justify-content: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    top: 0;
  }
  
  .sidebar-nav a:hover {
    transform: none;
  }
}
</style>