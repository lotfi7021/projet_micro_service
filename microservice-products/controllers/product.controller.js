const Product = require('../models/product.model');

exports.createProduct = async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      description: req.body.description || null,
      price: req.body.price,
      quantite: req.body.quantite,
      product_type_id: req.body.product_type_id,
      product_location_id: req.body.product_location_id || null,
      matricule: req.body.matricule || null,
      prix_achat: req.body.prix_achat || null,
      prix_vente: req.body.prix_vente || req.body.price,
      gestionnaire_username: req.user?.sub || 'system'
    };
    
    const productId = await Product.create(productData);
    res.status(201).json({ 
      id: productId, 
      message: 'Produit créé avec succès' 
    });
  } catch (err) {
    console.error('Erreur création produit:', err);
    
    if (err.message.includes('existe déjà')) {
      return res.status(409).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    console.error('Erreur récupération produits:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (err) {
    console.error('Erreur récupération produit:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductByMatricule = async (req, res) => {
  try {
    const product = await Product.getByMatricule(req.params.matricule);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (err) {
    console.error('Erreur récupération produit:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Terme de recherche requis' });
    }
    
    const products = await Product.searchProducts(q);
    res.json(products);
  } catch (err) {
    console.error('Erreur recherche produits:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const products = await Product.getByName(name);
    res.json(products);
  } catch (err) {
    console.error('Erreur récupération produits par nom:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByType = async (req, res) => {
  try {
    const { typeId } = req.params;
    const products = await Product.getByType(typeId);
    res.json(products);
  } catch (err) {
    console.error('Erreur récupération produits par type:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const products = await Product.getByLocation(locationId);
    res.json(products);
  } catch (err) {
    console.error('Erreur récupération produits par emplacement:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductsByPriceRange = async (req, res) => {
  try {
    const { min, max } = req.query;
    if (!min || !max) {
      return res.status(400).json({ error: 'Prix min et max requis' });
    }
    
    const products = await Product.getByPriceRange(parseFloat(min), parseFloat(max));
    res.json(products);
  } catch (err) {
    console.error('Erreur récupération produits par prix:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      gestionnaire_username: req.user?.sub || 'system'
    };
    
    await Product.update(req.params.id, updateData);
    res.json({ message: "Produit mis à jour avec succès" });
  } catch (err) {
    console.error('Erreur mise à jour produit:', err);
    
    if (err.message.includes('existe déjà') || err.message.includes('non trouvé')) {
      const statusCode = err.message.includes('existe déjà') ? 409 : 404;
      return res.status(statusCode).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};

exports.updateProductQuantite = async (req, res) => {
  try {
    const { matricule } = req.params;
    const { nouvelleQuantite } = req.body;
    const username = req.user?.sub || 'system';
    
    if (!nouvelleQuantite || nouvelleQuantite < 0) {
      return res.status(400).json({ error: 'Quantité invalide' });
    }
    
    await Product.updateQuantite(matricule, nouvelleQuantite, username);
    res.json({ message: "Quantité mise à jour avec succès" });
  } catch (err) {
    console.error('Erreur mise à jour quantité:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.decrementerQuantite = async (req, res) => {
  try {
    const { matricule } = req.params;
    const quantiteDemandee = Number(req.body.quantite);

    console.log('==============================');
    console.log('📥 Requête décrémentation');
    console.log('➡ Matricule reçu:', matricule);
    console.log('➡ Quantité demandée:', quantiteDemandee);

    // 1️⃣ Validation
    if (!quantiteDemandee || quantiteDemandee <= 0) {
      console.log('❌ Quantité invalide');
      return res.status(400).json({
        error: 'Quantité invalide'
      });
    }

    // 2️⃣ Appel logique métier
    const result = await Product.decrementerQuantite(
      matricule,
      quantiteDemandee
    );

    console.log('🎉 Décrémentation réussie');
    console.log(result);

    return res.json({
      message: 'Quantité décrémentée avec succès',
      ...result
    });

  } catch (error) {
    console.error('🔥 Erreur:', error.message);

    const status =
      error.message.includes('non trouvé') ? 404 :
      error.message.includes('Stock') ? 400 : 500;

    res.status(status).json({
      error: error.message
    });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const username = req.user?.sub || 'system';
    await Product.delete(req.params.id, username);
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    console.error('Erreur suppression produit:', err);
    res.status(500).json({ error: err.message });
  }
};