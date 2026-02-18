-- ================================
-- DATABASE : products_db
-- ================================
CREATE DATABASE IF NOT EXISTS products_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE products_db;

-- ================================
-- TABLE action_types
-- ================================
CREATE TABLE IF NOT EXISTS action_types (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_action_name (name)
) ENGINE=InnoDB;

INSERT INTO action_types (id, name) VALUES
(1, 'ADD_PRODUCT'),
(2, 'DELETE_PRODUCT'),
(3, 'UPDATE_PRODUCT'),
(4, 'UPDATE_PRODUCT_QUANTITY'),
(10, 'RECORD_SALE')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ================================
-- TABLE product_types
-- ================================
CREATE TABLE IF NOT EXISTS product_types (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO product_types (id, name) VALUES
(1, 'Électronique Modifié'),
(4, 'Entrepôt A'),
(5, 'Électronique')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ================================
-- TABLE product_locations
-- ================================
CREATE TABLE IF NOT EXISTS product_locations (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO product_locations (id, name, description) VALUES
(1, 'Entrepôt B', 'Emplacement secondaire'),
(2, 'Entrepôt A', 'Emplacement secondaire')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ================================
-- TABLE products
-- ================================
CREATE TABLE IF NOT EXISTS products (
    id INT NOT NULL AUTO_INCREMENT,
    matricule VARCHAR(100) NOT NULL,
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
    PRIMARY KEY (id),
    UNIQUE KEY uk_product_matricule (matricule),
    CONSTRAINT fk_product_type
        FOREIGN KEY (product_type_id)
        REFERENCES product_types(id),
    CONSTRAINT fk_product_location
        FOREIGN KEY (product_location_id)
        REFERENCES product_locations(id)
) ENGINE=InnoDB;

INSERT INTO products (id, matricule, name, description, price, quantite, prix_achat, prix_vente, quantite_vendue_totale, product_type_id, product_location_id) VALUES
(1, 'PROD-001', 'Smartphone Pro', 'Téléphone Android haut de gamme - Version Pro', 999.99, 37, 650.00, 999.99, 10, 1, 1),
(2, 'PROD-002', 'Smartphonex', 'Téléphone Android haut de gamme', 899.99, 45, 600.00, 899.99, 5, 1, 1),
(3, 'PROD-012', 'Smartphoneg', 'Téléphone Android haut de gamme', 899.99, 50, 600.00, 899.99, 0, 1, 1),
(4, 'PROD-072', 'Smartphoeg', 'Téléphone Android haut de gamme', 899.99, 50, 600.00, 899.99, 0, 1, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ================================
-- TABLE historique_produit
-- ================================
CREATE TABLE IF NOT EXISTS historique_produit (
    id INT NOT NULL AUTO_INCREMENT,
    product_matricule VARCHAR(100) NOT NULL,
    gestionnaire_username VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    quantite_avant INT,
    quantite_apres INT,
    quantite_totale INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_historique_action
        FOREIGN KEY (action_type)
        REFERENCES action_types(name)
) ENGINE=InnoDB;

INSERT INTO historique_produit (id, product_matricule, gestionnaire_username, action_type, quantite_avant, quantite_apres, quantite_totale) VALUES
(4, 'PROD-012', 'alicemanager', 'ADD_PRODUCT', 0, 50, 0),
(5, 'PROD-072', 'alicemanager', 'ADD_PRODUCT', 0, 50, 0),
(6, 'PROD-001', 'alicemanager', 'UPDATE_PRODUCT_QUANTITY', 45, 60, 0),
(7, 'PROD-001', 'alicemanager', 'UPDATE_PRODUCT', 60, 45, 0)
ON DUPLICATE KEY UPDATE product_matricule = VALUES(product_matricule);