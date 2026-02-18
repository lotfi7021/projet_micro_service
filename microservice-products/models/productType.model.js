const { getConnection } = require('../config/db');

class ProductType {
  static async checkDuplicate(name, excludeId = null) {
    const conn = getConnection();
    
    // Convertir le nom en minuscules pour une comparaison insensible à la casse
    const nameLower = name.toLowerCase();
    
    let query = `SELECT id FROM product_types WHERE LOWER(name) = ?`;
    const params = [nameLower];
    
    if (excludeId) {
      query += ` AND id != ?`;
      params.push(excludeId);
    }
    
    const [rows] = await conn.execute(query, params);
    return rows.length > 0;
  }

  static async create(name) {
    const conn = getConnection();
    
    // Vérifier si le type existe déjà (insensible à la casse)
    const exists = await this.checkDuplicate(name);
    if (exists) {
      throw new Error('Un type de produit avec ce nom existe déjà');
    }
    
    const [result] = await conn.execute(
      `INSERT INTO product_types (name) VALUES (?)`,
      [name]
    );
    return result.insertId;
  }

  static async getAll() {
    const conn = getConnection();
    const [rows] = await conn.execute(`SELECT * FROM product_types ORDER BY name`);
    return rows;
  }

  static async getById(id) {
    const conn = getConnection();
    const [rows] = await conn.execute(`SELECT * FROM product_types WHERE id = ?`, [id]);
    return rows[0];
  }

  static async getByName(name) {
    const conn = getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM product_types WHERE name LIKE ? ORDER BY name`,
      [`%${name}%`]
    );
    return rows;
  }

  static async getByNameExact(name) {
    const conn = getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM product_types WHERE LOWER(name) = LOWER(?)`,
      [name]
    );
    return rows[0];
  }

  static async update(id, name) {
    const conn = getConnection();
    
    // Vérifier si le produit existe
    const existingType = await this.getById(id);
    if (!existingType) {
      throw new Error('Type de produit non trouvé');
    }
    
    // Vérifier si le nom existe déjà pour un autre type (insensible à la casse)
    const exists = await this.checkDuplicate(name, id);
    if (exists) {
      throw new Error('Un autre type de produit avec ce nom existe déjà');
    }
    
    await conn.execute(
      `UPDATE product_types SET name = ? WHERE id = ?`,
      [name, id]
    );
    return this.getById(id);
  }

  static async delete(id) {
    const conn = getConnection();
    
    // Vérifier si le type existe
    const existingType = await this.getById(id);
    if (!existingType) {
      throw new Error('Type de produit non trouvé');
    }
    
    // Vérifier si le type est utilisé par des produits
    const [usedProducts] = await conn.execute(
      `SELECT COUNT(*) as count FROM products WHERE product_type_id = ?`,
      [id]
    );
    
    if (usedProducts[0].count > 0) {
      throw new Error('Impossible de supprimer ce type car il est utilisé par des produits');
    }
    
    const [result] = await conn.execute(`DELETE FROM product_types WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const conn = getConnection();
    const [rows] = await conn.execute(`SELECT COUNT(*) as count FROM product_types`);
    return rows[0].count;
  }
}

module.exports = ProductType;