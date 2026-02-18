-- ================================
-- DATABASE : reclamation_db
-- ================================
CREATE DATABASE IF NOT EXISTS reclamation_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE reclamation_db;

-- ================================
-- TABLE type_reclamation
-- ================================
CREATE TABLE IF NOT EXISTS type_reclamation (
    id BIGINT NOT NULL AUTO_INCREMENT,
    type_reclamation VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_type_reclamation (type_reclamation)
) ENGINE=InnoDB;

INSERT INTO type_reclamation (id, type_reclamation) VALUES
(1, 'NOTIFICATION'),
(2, 'MANQUE_STOCK'),
(3, 'PROBLEM_SERVER')
ON DUPLICATE KEY UPDATE type_reclamation = VALUES(type_reclamation);

-- ================================
-- TABLE reclamation
-- ================================
CREATE TABLE IF NOT EXISTS reclamation (
    id BIGINT NOT NULL AUTO_INCREMENT,
    date_reclamation DATETIME(6),
    description VARCHAR(255),
    etat VARCHAR(255),
    matricule VARCHAR(255),
    nom_user VARCHAR(255),
    role VARCHAR(255),
    type_reclamation_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT fk_reclamation_type
        FOREIGN KEY (type_reclamation_id)
        REFERENCES type_reclamation(id)
) ENGINE=InnoDB;

INSERT INTO reclamation (id, date_reclamation, description, etat, matricule, nom_user, role, type_reclamation_id) VALUES
(1, '2025-12-25 20:14:17.000000', 'Problème serveur', 'VALIDEE', 'MAT001', 'admin', 'ADMIN', 1),
(2, '2025-12-25 21:19:24.000000', 'Problème de salaire', 'NON_VALIDE', 'EMP123', 'Ali Ben Salah', 'USER', 2),
(3, '2025-12-25 21:27:27.000000', 'Problème congé', 'VALIDEE', 'EMP01', 'Ali', 'USER', 3)
ON DUPLICATE KEY UPDATE description = VALUES(description);