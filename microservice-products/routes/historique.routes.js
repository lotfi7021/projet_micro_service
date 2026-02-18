const express = require('express');
const router = express.Router();
const historiqueController = require('../controllers/historique.controller');

router.get('/', historiqueController.getAllHistorique);
router.get('/recent', historiqueController.getRecentActions);
router.get('/matricule/:matricule', historiqueController.getHistoriqueByMatricule);
router.get('/action/:actionType', historiqueController.getHistoriqueByActionType);
router.get('/gestionnaire/:username', historiqueController.getHistoriqueByGestionnaire);
router.get('/date-range', historiqueController.getHistoriqueByDateRange);

module.exports = router;