const mysql = require('mysql2/promise');

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

let connection;

async function initDB() {
  const conn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
  await conn.end();

  connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });

  await createTables();
  console.log("✅ products_db prête");
}

async function createTables() {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS action_types (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL UNIQUE
    )
  `);

  await connection.execute(`
    INSERT IGNORE INTO action_types (name) VALUES 
    ('ADD_PRODUCT'),
    ('UPDATE_PRODUCT_QUANTITY'),
    ('UPDATE_PRODUCT'),
    ('DELETE_PRODUCT'),
    ('RECORD_SALE')
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS product_types (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL
    )
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS product_locations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      description TEXT NOT NULL
    )
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      matricule VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      quantite INT NOT NULL,
      prix_achat DECIMAL(10,2) NOT NULL,
      prix_vente DECIMAL(10,2) NOT NULL,
      quantite_vendue_totale INT NOT NULL DEFAULT 0,
      product_type_id INT NOT NULL,
      product_location_id INT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (product_type_id) REFERENCES product_types(id),
      FOREIGN KEY (product_location_id) REFERENCES product_locations(id)
    )
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS historique_produit (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_matricule VARCHAR(100) NOT NULL,
      gestionnaire_username VARCHAR(100) NOT NULL,
      action_type VARCHAR(50) NOT NULL,
      quantite_avant INT,
      quantite_apres INT,
      quantite_totale INT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (action_type) REFERENCES action_types(name),
      INDEX idx_matricule (product_matricule),
      INDEX idx_action (action_type),
      INDEX idx_gestionnaire (gestionnaire_username),
      INDEX idx_date (created_at)
    )
  `);
}

module.exports = { initDB, getConnection: () => connection };