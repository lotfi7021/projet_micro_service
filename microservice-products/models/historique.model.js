const { getConnection } = require('../config/db');

class Historique {
  static async logAction(matricule, username, actionType, quantiteAvant, quantiteApres) {
    const conn = getConnection();
    
    await conn.execute(
      `INSERT INTO historique_produit 
       (product_matricule, gestionnaire_username, action_type, 
        quantite_avant, quantite_apres)
       VALUES (?, ?, ?, ?, ?)`,
      [matricule, username, actionType, quantiteAvant, quantiteApres]
    );
  }

  static async getAll() {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT h.*, p.name as product_name 
      FROM historique_produit h
      LEFT JOIN products p ON h.product_matricule = p.matricule
      ORDER BY h.created_at DESC
    `);
    return rows;
  }

  static async getByMatricule(matricule) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT h.*, p.name as product_name 
      FROM historique_produit h
      LEFT JOIN products p ON h.product_matricule = p.matricule
      WHERE h.product_matricule = ?
      ORDER BY h.created_at DESC
    `, [matricule]);
    return rows;
  }

  static async getByActionType(actionType) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT h.*, p.name as product_name 
      FROM historique_produit h
      LEFT JOIN products p ON h.product_matricule = p.matricule
      WHERE h.action_type = ?
      ORDER BY h.created_at DESC
    `, [actionType]);
    return rows;
  }

  static async getByGestionnaire(username) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT h.*, p.name as product_name 
      FROM historique_produit h
      LEFT JOIN products p ON h.product_matricule = p.matricule
      WHERE h.gestionnaire_username = ?
      ORDER BY h.created_at DESC
    `, [username]);
    return rows;
  }

  static async getByDateRange(startDate, endDate) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT h.*, p.name as product_name 
      FROM historique_produit h
      LEFT JOIN products p ON h.product_matricule = p.matricule
      WHERE h.created_at BETWEEN ? AND ?
      ORDER BY h.created_at DESC
    `, [startDate, endDate]);
    return rows;
  }

  static async getRecentActions(limit = 50) {
    const conn = getConnection();
    const [rows] = await conn.execute(`
      SELECT h.*, p.name as product_name 
      FROM historique_produit h
      LEFT JOIN products p ON h.product_matricule = p.matricule
      ORDER BY h.created_at DESC
      LIMIT ?
    `, [limit]);
    return rows;
  }
}

module.exports = Historique;