const { getConnection } = require('../config/db');
const Historique = require('./historique.model');

class Product {
  static async checkDuplicate(matricule, name) {
    const conn = getConnection();
    const [rows] = await conn.execute(
      `SELECT id FROM products WHERE matricule = ? OR name = ?`,
      [matricule, name]
    );
    return rows.length > 0;
  }

  static async create(data) {
    const conn = getConnection();
    
    // Vérifier si matricule ou nom existe déjà
    const exists = await this.checkDuplicate(data.matricule, data.name);
    if (exists) {
      throw new Error('Un produit avec ce matricule ou ce nom existe déjà');
    }
    
    const matricule = data.matricule || `PROD-${Date.now()}`;
    
    const [result] = await conn.execute(
  `INSERT INTO products (name, description, price, quantite, product_type_id, product_location_id,
    matricule, prix_achat, prix_vente, quantite_vendue_totale)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    data.name,
    data.description ?? null,
    data.price,
    data.quantite,
    data.product_type_id,
    data.product_location_id ?? null,
    matricule,           // use generated matricule
    data.prix_achat ?? null,
    data.prix_vente ?? null,
    0
  ]
);

    
    // Log historique
    await Historique.logAction(
      matricule,
      data.gestionnaire_username || 'system',
      'ADD_PRODUCT',
      0,
      data.quantite
    );
    
    return result.insertId;
  }

  static async getAll() {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT p.*, pt.name as type_name, pl.name as location_name 
      FROM products p
      LEFT JOIN product_types pt ON p.product_type_id = pt.id
      LEFT JOIN product_locations pl ON p.product_location_id = pl.id
      ORDER BY p.created_at DESC
    `);
    return rows;
  }

  static async getById(id) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT p.*, pt.name as type_name, pl.name as location_name 
      FROM products p
      LEFT JOIN product_types pt ON p.product_type_id = pt.id
      LEFT JOIN product_locations pl ON p.product_location_id = pl.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async getByMatricule(matricule) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT p.*, pt.name as type_name, pl.name as location_name 
      FROM products p
      LEFT JOIN product_types pt ON p.product_type_id = pt.id
      LEFT JOIN product_locations pl ON p.product_location_id = pl.id
      WHERE p.matricule = ?
    `, [matricule]);
    return rows[0];
  }

  static async getByName(name) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT p.*, pt.name as type_name, pl.name as location_name 
      FROM products p
      LEFT JOIN product_types pt ON p.product_type_id = pt.id
      LEFT JOIN product_locations pl ON p.product_location_id = pl.id
      WHERE p.name LIKE ?
      ORDER BY p.name
    `, [`%${name}%`]);
    return rows;
  }

  static async getByType(typeId) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT p.*, pt.name as type_name, pl.name as location_name 
      FROM products p
      LEFT JOIN product_types pt ON p.product_type_id = pt.id
      LEFT JOIN product_locations pl ON p.product_location_id = pl.id
      WHERE p.product_type_id = ?
      ORDER BY p.name
    `, [typeId]);
    return rows;
  }

  static async getByLocation(locationId) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT p.*, pt.name as type_name, pl.name as location_name 
      FROM products p
      LEFT JOIN product_types pt ON p.product_type_id = pt.id
      LEFT JOIN product_locations pl ON p.product_location_id = pl.id
      WHERE p.product_location_id = ?
      ORDER BY p.name
    `, [locationId]);
    return rows;
  }

  static async getByPriceRange(minPrice, maxPrice) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT p.*, pt.name as type_name, pl.name as location_name 
      FROM products p
      LEFT JOIN product_types pt ON p.product_type_id = pt.id
      LEFT JOIN product_locations pl ON p.product_location_id = pl.id
      WHERE p.price BETWEEN ? AND ?
      ORDER BY p.price
    `, [minPrice, maxPrice]);
    return rows;
  }

  static async searchProducts(searchTerm) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT p.*, pt.name as type_name, pl.name as location_name 
      FROM products p
      LEFT JOIN product_types pt ON p.product_type_id = pt.id
      LEFT JOIN product_locations pl ON p.product_location_id = pl.id
      WHERE p.name LIKE ? OR p.matricule LIKE ? OR p.description LIKE ?
      ORDER BY p.name
    `, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
    return rows;
  }

  static async update(id, data) {
    const conn = getConnection();
    
    // Récupérer l'ancien produit
    const oldProduct = await Product.getById(id);
    if (!oldProduct) {
      throw new Error('Produit non trouvé');
    }
    
    // Vérifier si le nouveau nom ou matricule existe déjà pour un autre produit
    const [duplicateRows] = await conn.execute(
      `SELECT id FROM products WHERE (matricule = ? OR name = ?) AND id != ?`,
      [data.matricule || oldProduct.matricule, data.name, id]
    );
    
    if (duplicateRows.length > 0) {
      throw new Error('Un autre produit avec ce matricule ou ce nom existe déjà');
    }
    
    await conn.execute(
      `UPDATE products SET name=?, description=?, price=?, quantite=?, 
       product_type_id=?, product_location_id=?, prix_achat=?, prix_vente=?,
       matricule=?
       WHERE id=?`,
      [
        data.name, data.description, data.price, data.quantite, 
        data.product_type_id, data.product_location_id,
        data.prix_achat, data.prix_vente,
        data.matricule || oldProduct.matricule,
        id
      ]
    );
    
    // Log historique
    await Historique.logAction(
      data.matricule || oldProduct.matricule,
      data.gestionnaire_username || 'system',
      'UPDATE_PRODUCT',
      oldProduct.quantite,
      data.quantite
    );
  }

  static async updateQuantite(matricule, nouvelleQuantite, username) {
    const conn = getConnection();
    
    // Récupérer l'ancienne quantité
    const product = await Product.getByMatricule(matricule);
    if (!product) throw new Error('Produit non trouvé');
    
    const ancienneQuantite = product.quantite;
    
    await conn.execute(
      `UPDATE products SET quantite = ? WHERE matricule = ?`,
      [nouvelleQuantite, matricule]
    );
    
    // Log historique
    await Historique.logAction(
      matricule,
      username,
      'UPDATE_PRODUCT_QUANTITY',
      ancienneQuantite,
      nouvelleQuantite
    );
  }

static async decrementerQuantite(matricule, quantiteDemandee) {
  const conn = getConnection();

  console.log('🔹 Début décrémentation');
  console.log('➡ Matricule:', matricule);
  console.log('➡ Quantité demandée:', quantiteDemandee);

  // 1️⃣ Récupération produit
  const [rows] = await conn.execute(
    `SELECT quantite, quantite_vendue_totale
     FROM products
     WHERE matricule = ?`,
    [matricule]
  );

  if (rows.length === 0) {
    console.log('❌ Produit non trouvé');
    throw new Error('Produit non trouvé');
  }

  const produit = rows[0];

  console.log('📦 Quantité en BD:', produit.quantite);
  console.log('📊 Quantité vendue totale:', produit.quantite_vendue_totale);

  // 2️⃣ Vérification stock
  if (quantiteDemandee > produit.quantite) {
    console.log('❌ Stock insuffisant');
    throw new Error(
      `Stock insuffisant (${produit.quantite} disponible)`
    );
  }

  // 3️⃣ Calculs
  const nouvelleQuantite = produit.quantite - quantiteDemandee;
  const nouvelleQuantiteVendueTotale =
    produit.quantite_vendue_totale + quantiteDemandee;

  console.log('🧮 Nouvelle quantité:', nouvelleQuantite);
  console.log('🧮 Nouvelle quantité vendue totale:', nouvelleQuantiteVendueTotale);

  // 4️⃣ Mise à jour BD
  await conn.execute(
    `UPDATE products
     SET quantite = ?, quantite_vendue_totale = ?
     WHERE matricule = ?`,
    [nouvelleQuantite, nouvelleQuantiteVendueTotale, matricule]
  );

  console.log('✅ Mise à jour terminée');

  return {
    quantiteAvant: produit.quantite,
    quantiteApres: nouvelleQuantite,
    quantiteVendueTotale: nouvelleQuantiteVendueTotale
  };
}



  static async delete(id, username) {
    const conn = getConnection();
    
    // Récupérer le produit avant suppression
    const product = await Product.getById(id);
    if (!product) throw new Error('Produit non trouvé');
    
    await conn.execute(`DELETE FROM products WHERE id=?`, [id]);
    
    // Log historique
    await Historique.logAction(
      product.matricule,
      username,
      'DELETE_PRODUCT',
      product.quantite,
      0
    );
  }
}

module.exports = Product;