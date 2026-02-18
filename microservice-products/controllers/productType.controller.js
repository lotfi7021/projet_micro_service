const ProductType = require('../models/productType.model');

exports.createProductType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Le nom est requis" });
    }
    
    const id = await ProductType.create(name);
    res.status(201).json({ 
      id, 
      message: "Type de produit créé avec succès" 
    });
  } catch (err) {
    console.error('Erreur création type produit:', err);
    
    if (err.message.includes('existe déjà')) {
      return res.status(409).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProductTypes = async (req, res) => {
  try {
    const types = await ProductType.getAll();
    res.json(types);
  } catch (err) {
    console.error('Erreur récupération types:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const productType = await ProductType.getById(id);
    
    if (!productType) {
      return res.status(404).json({ error: "Type de produit non trouvé" });
    }
    
    res.json(productType);
  } catch (err) {
    console.error('Erreur récupération type produit:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductTypeByName = async (req, res) => {
  try {
    const { name } = req.params;
    const types = await ProductType.getByName(name);
    res.json(types);
  } catch (err) {
    console.error('Erreur recherche types par nom:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Le nom est requis" });
    }
    
    const updatedType = await ProductType.update(id, name);
    res.json({ 
      message: "Type de produit mis à jour avec succès",
      productType: updatedType
    });
  } catch (err) {
    console.error('Erreur mise à jour type produit:', err);
    
    if (err.message.includes('existe déjà')) {
      return res.status(409).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductType.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Type de produit non trouvé" });
    }
    
    res.json({ message: "Type de produit supprimé avec succès" });
  } catch (err) {
    console.error('Erreur suppression type produit:', err);
    
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ 
        error: "Impossible de supprimer ce type car il est utilisé par des produits" 
      });
    }
    
    res.status(500).json({ error: err.message });
  }
};

exports.getProductTypeStats = async (req, res) => {
  try {
    const count = await ProductType.count();
    res.json({ total: count });
  } catch (err) {
    console.error('Erreur statistiques types:', err);
    res.status(500).json({ error: err.message });
  }
};