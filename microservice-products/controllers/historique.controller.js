const Historique = require('../models/historique.model');

exports.getAllHistorique = async (req, res) => {
  try {
    const historique = await Historique.getAll();
    res.json(historique);
  } catch (err) {
    console.error('Erreur récupération historique:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getHistoriqueByMatricule = async (req, res) => {
  try {
    const { matricule } = req.params;
    const historique = await Historique.getByMatricule(matricule);
    res.json(historique);
  } catch (err) {
    console.error('Erreur récupération historique produit:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getHistoriqueByActionType = async (req, res) => {
  try {
    const { actionType } = req.params;
    const historique = await Historique.getByActionType(actionType);
    res.json(historique);
  } catch (err) {
    console.error('Erreur récupération historique par action:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getHistoriqueByGestionnaire = async (req, res) => {
  try {
    const { username } = req.params;
    const historique = await Historique.getByGestionnaire(username);
    res.json(historique);
  } catch (err) {
    console.error('Erreur récupération historique gestionnaire:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getHistoriqueByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Dates de début et fin requises' });
    }
    
    const historique = await Historique.getByDateRange(startDate, endDate);
    res.json(historique);
  } catch (err) {
    console.error('Erreur récupération historique par date:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentActions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const historique = await Historique.getRecentActions(limit);
    res.json(historique);
  } catch (err) {
    console.error('Erreur récupération actions récentes:', err);
    res.status(500).json({ error: err.message });
  }
};