-- ================================
-- DATABASE : microservice_facture
-- ================================
CREATE DATABASE IF NOT EXISTS microservice_facture
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE microservice_facture;

-- ================================
-- TABLE factures
-- ================================
CREATE TABLE IF NOT EXISTS factures (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    date_creation DATE NOT NULL,
    name_vendeur VARCHAR(255) NOT NULL,
    totale_vente DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO factures (id, date_creation, name_vendeur, totale_vente) VALUES
(1, '2025-01-15', 'Ali', 1550.00),
(2, '2025-01-15', 'Ali', 1600.00),
(7, '2025-01-15', 'Ali', 1600.00),
(8, '2025-01-15', 'mohamed', 1600.00),
(9, '2025-01-10', 'Ali', 280.00)
ON DUPLICATE KEY UPDATE name_vendeur = VALUES(name_vendeur);

-- ================================
-- TABLE facture_produits
-- ================================
CREATE TABLE IF NOT EXISTS facture_produits (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_facture BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    matricule VARCHAR(255) NOT NULL,
    quantite INT NOT NULL,
    prix_vente DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_facture_produit
        FOREIGN KEY (id_facture)
        REFERENCES factures(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO facture_produits (id, id_facture, product_name, matricule, quantite, prix_vente) VALUES
(1, 1, 'PC HP', 'HP-001', 1, 1200.00),
(2, 1, 'Souris', 'MS-002', 2, 175.00),
(3, 2, 'PC HP', 'HP-001', 1, 1200.00),
(4, 7, 'PC HP', 'PROD-001', 1, 1200.00),
(5, 7, 'Clavier Logitech', 'PROD-002', 2, 200.00),
(6, 8, 'PC HP', 'PROD-001', 1, 1200.00),
(7, 8, 'Clavier Logitech', 'PROD-002', 2, 200.00),
(8, 9, 'Smartphone Pro', 'PROD-001', 2, 120.00),
(9, 9, 'Smartphonex', 'PROD-002', 1, 40.00)
ON DUPLICATE KEY UPDATE product_name = VALUES(product_name);