<template>
  <div class="dashboard">
    <Navbar />
    <Sidebar />

    <main class="main-content">
      <h1>Gestion du Stock</h1>

      <div class="cards">
        <div class="card value-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="card-content">
            <p class="card-label">Valeur du stock</p>
            <h2 class="card-value">12 450 000 DA</h2>
          </div>
        </div>

        <div class="card rupture-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="card-content">
            <p class="card-label">Articles en rupture</p>
            <h2 class="card-value">4</h2>
          </div>
        </div>

        <div class="card entries-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div class="card-content">
            <p class="card-label">Entrées récentes</p>
            <h2 class="card-value">18</h2>
          </div>
        </div>
      </div>

      <p class="welcome">Bienvenue, {{ username }} (Gestionnaire de stock)</p>
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

const username = localStorage.getItem('username') || 'Stock'
</script>

<style scoped>
.main-content {
  margin-left: 260px;
  padding: 30px 40px;
  margin-top: 60px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 60px);
}

.main-content h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 30px 0;
  letter-spacing: -0.5px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin: 30px 0;
}

.card {
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 20px;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: width 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card:hover::before {
  width: 100%;
  opacity: 0.05;
}

.value-card::before {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.rupture-card::before {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.entries-card::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.value-card .card-icon {
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%);
  color: #43e97b;
}

.rupture-card .card-icon {
  background: linear-gradient(135deg, rgba(250, 112, 154, 0.1) 0%, rgba(254, 225, 64, 0.1) 100%);
  color: #fa709a;
}

.entries-card .card-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0 0 8px 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

.welcome {
  margin-top: 40px;
  font-size: 1.3rem;
  color: #555;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }

  .main-content h1 {
    font-size: 1.8rem;
  }

  .cards {
    grid-template-columns: 1fr;
  }
}
</style>