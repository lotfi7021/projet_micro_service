-- ================================
-- DATABASE
-- ================================
CREATE DATABASE IF NOT EXISTS auth_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE auth_db;

-- ================================
-- TABLE ROLES
-- ================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_role_name (name)
) ENGINE=InnoDB;

INSERT INTO roles (id, name) VALUES
(1, 'VENDEUR'),
(2, 'GESTIONNAIRE_STOCK'),
(3, 'ADMIN')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ================================
-- TABLE USERS
-- ================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    caisse_number VARCHAR(255),
    date_debut DATE,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    mail VARCHAR(255) NOT NULL,
    matricule_user VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    role_id BIGINT,
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_mail (mail),
    UNIQUE KEY uk_user_matricule (matricule_user),
    UNIQUE KEY uk_user_username (username),
    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
) ENGINE=InnoDB;

INSERT INTO users
(id, caisse_number, date_debut, firstname, lastname, mail, matricule_user, password, telephone, username, role_id)
VALUES
(1, NULL, '2025-12-22', 'admin', 'admin', 'admin@gmail.com', '000',
'$2a$10$/O4ljD7mLGld89iWwyFDg.Q4fTC0O00FArFqaAcHV/2mMAxsEJQsS',
NULL, 'admin', 3),

(2, NULL, '2025-12-23', 'Ali', 'Ben Salah', 'gestion1@gmail.com', 'G001',
'$2a$10$MYJ83I8WS/NcipheP33gTe0YJo169nBhjUnneU.g6TuQMWWgiBfHi',
'22114455', 'gestion1', 2)
ON DUPLICATE KEY UPDATE username = VALUES(username);
