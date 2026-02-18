<template>
  <div class="dashboard">
    <Navbar />
    <Sidebar />

    <main class="main-content">
      <h1>Espace Vendeur</h1>

      <div class="cards">
        <div class="card sales-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div class="card-content">
            <p class="card-label">Ventes aujourd'hui</p>
            <h2 class="card-value">14</h2>
          </div>
        </div>

        <div class="card revenue-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div class="card-content">
            <p class="card-label">Chiffre d'affaires</p>
            <h2 class="card-value">285 000 DA</h2>
          </div>
        </div>

        <div class="card clients-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="card-content">
            <p class="card-label">Clients reçus</p>
            <h2 class="card-value">9</h2>
          </div>
        </div>
      </div>

      <p class="welcome">Bienvenue, {{ username }} (Vendeur)</p>
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

const username = localStorage.getItem('username') || 'Vendeur'
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

.sales-card::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.revenue-card::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.clients-card::before {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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

.sales-card .card-icon {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
}

.revenue-card .card-icon {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
  color: #f5576c;
}

.clients-card .card-icon {
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  color: #4facfe;
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