require('dotenv').config();
const express = require('express');
const { initDB } = require('./config/db');
const eurekaClient = require('./eureka-client');

const productRoutes = require('./routes/products.routes');
// ... autres imports

const app = express();
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
// ... autres routes

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'UP',
    service: 'products-microservice'
  });
});

// Démarrage
initDB().then(() => {
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, '0.0.0.0', () => {  // ← ICI, AJOUTER '0.0.0.0'
    console.log(`🟢 Products service running on port ${PORT}`);
    
    // Démarrer le client Eureka
    eurekaClient.start(error => {
      if (error) {
        console.error('❌ Erreur Eureka:', error);
      } else {
        console.log('✅ Service enregistré sur Eureka');
      }
    });
  });
}).catch(err => {
  console.error('❌ Erreur démarrage DB:', err);
  process.exit(1);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  eurekaClient.stop();
  process.exit();
});