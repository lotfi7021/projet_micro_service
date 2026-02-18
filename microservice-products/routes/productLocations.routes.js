const express = require('express');
const router = express.Router();
const productLocationController = require('../controllers/productLocation.controller');


// Routes publiques (lecture)
router.get('/', productLocationController.getAllProductLocations);
router.get('/search', productLocationController.searchProductLocations);
router.get('/stats', productLocationController.getProductLocationStats);
router.get('/name/:name', productLocationController.getProductLocationByName);
router.get('/:id', productLocationController.getProductLocationById);

// Routes protégées (écriture)
router.post('/', productLocationController.createProductLocation);
router.put('/:id', productLocationController.updateProductLocation);
router.delete('/:id', productLocationController.deleteProductLocation);

module.exports = router;