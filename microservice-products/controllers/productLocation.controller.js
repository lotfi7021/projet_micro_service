const ProductLocation = require('../models/productLocation.model');

exports.createProductLocation = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: "Nom et description sont requis" });
    }
    
    const id = await ProductLocation.create({ name, description });
    res.status(201).json({ 
      id, 
      message: "Emplacement créé avec succès" 
    });
  } catch (err) {
    console.error('Erreur création emplacement:', err);
    
    if (err.message.includes('existe déjà')) {
      return res.status(409).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProductLocations = async (req, res) => {
  try {
    const locations = await ProductLocation.getAll();
    res.json(locations);
  } catch (err) {
    console.error('Erreur récupération emplacements:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await ProductLocation.getById(id);
    
    if (!location) {
      return res.status(404).json({ error: "Emplacement non trouvé" });
    }
    
    res.json(location);
  } catch (err) {
    console.error('Erreur récupération emplacement:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductLocationByName = async (req, res) => {
  try {
    const { name } = req.params;
    const locations = await ProductLocation.getByName(name);
    res.json(locations);
  } catch (err) {
    console.error('Erreur recherche emplacements par nom:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.searchProductLocations = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: "Terme de recherche requis" });
    }
    
    const locations = await ProductLocation.search(q);
    res.json(locations);
  } catch (err) {
    console.error('Erreur recherche emplacements:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProductLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: "Nom et description sont requis" });
    }
    
    const updatedLocation = await ProductLocation.update(id, { name, description });
    res.json({ 
      message: "Emplacement mis à jour avec succès",
      location: updatedLocation
    });
  } catch (err) {
    console.error('Erreur mise à jour emplacement:', err);
    
    if (err.message.includes('existe déjà')) {
      return res.status(409).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProductLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductLocation.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Emplacement non trouvé" });
    }
    
    res.json({ message: "Emplacement supprimé avec succès" });
  } catch (err) {
    console.error('Erreur suppression emplacement:', err);
    
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ 
        error: "Impossible de supprimer cet emplacement car il est utilisé par des produits" 
      });
    }
    
    res.status(500).json({ error: err.message });
  }
};

exports.getProductLocationStats = async (req, res) => {
  try {
    const count = await ProductLocation.count();
    res.json({ total: count });
  } catch (err) {
    console.error('Erreur statistiques emplacements:', err);
    res.status(500).json({ error: err.message });
  }
};