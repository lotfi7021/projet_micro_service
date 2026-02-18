const { getConnection } = require('../config/db');

class ProductLocation {
  static async checkDuplicate(name, excludeId = null) {
    const conn = getConnection();
    let query = `SELECT id FROM product_locations WHERE name = ?`;
    const params = [name];
    
    if (excludeId) {
      query += ` AND id != ?`;
      params.push(excludeId);
    }
    
    const [rows] = await conn.execute(query, params);
    return rows.length > 0;
  }

  static async create(data) {
    const conn = getConnection();
    
    // Vérifier si l'emplacement existe déjà
    const exists = await this.checkDuplicate(data.name);
    if (exists) {
      throw new Error('Un emplacement avec ce nom existe déjà');
    }
    
    const [result] = await conn.execute(
      `INSERT INTO product_locations (name, description) VALUES (?, ?)`,
      [data.name, data.description]
    );
    return result.insertId;
  }

  static async getAll() {
    const conn = getConnection();
    const [rows] = await conn.execute(`SELECT * FROM product_locations ORDER BY name`);
    return rows;
  }

  static async getById(id) {
    const conn = getConnection();
    const [rows] = await conn.execute(`SELECT * FROM product_locations WHERE id = ?`, [id]);
    return rows[0];
  }

  static async getByName(name) {
    const conn = getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM product_locations WHERE name LIKE ? ORDER BY name`,
      [`%${name}%`]
    );
    return rows;
  }

  static async search(searchTerm) {
    const conn = getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM product_locations 
       WHERE name LIKE ? OR description LIKE ? 
       ORDER BY name`,
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return rows;
  }

  static async update(id, data) {
    const conn = getConnection();
    
    // Vérifier si le nom existe déjà pour un autre emplacement
    const exists = await this.checkDuplicate(data.name, id);
    if (exists) {
      throw new Error('Un autre emplacement avec ce nom existe déjà');
    }
    
    await conn.execute(
      `UPDATE product_locations SET name = ?, description = ? WHERE id = ?`,
      [data.name, data.description, id]
    );
    return this.getById(id);
  }

  static async delete(id) {
    const conn = getConnection();
    const [result] = await conn.execute(`DELETE FROM product_locations WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }

  static async count() {
    const conn = getConnection();
    const [rows] = await conn.execute(`SELECT COUNT(*) as count FROM product_locations`);
    return rows[0].count;
  }
}

module.exports = ProductLocation;