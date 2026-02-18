const express = require('express');
const router = express.Router();
const productTypeController = require('../controllers/productType.controller');


// Routes publiques (lecture)
router.get('/', productTypeController.getAllProductTypes);
router.get('/stats', productTypeController.getProductTypeStats);
router.get('/search/:name', productTypeController.getProductTypeByName);
router.get('/:id', productTypeController.getProductTypeById);

// Routes protégées (écriture)
router.post('/', productTypeController.createProductType);
router.put('/:id', productTypeController.updateProductType);
router.delete('/:id', productTypeController.deleteProductType);

module.exports = router;