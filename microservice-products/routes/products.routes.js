const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');


// Routes publiques (lecture)
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/price-range', productController.getProductsByPriceRange);
router.get('/by-name/:name', productController.getProductsByName);
router.get('/by-type/:typeId', productController.getProductsByType);
router.get('/by-location/:locationId', productController.getProductsByLocation);
router.get('/:id', productController.getProductById);
router.get('/matricule/:matricule', productController.getProductByMatricule);

// Routes protégées (écriture)
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.put('/matricule/:matricule/quantite', productController.updateProductQuantite);
router.put('/matricule/:matricule/decrementer', productController.decrementerQuantite);
router.delete('/:id',  productController.deleteProduct);

module.exports = router;