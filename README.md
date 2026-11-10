# Projet Microservices — Gestion de Stock & Facturation

Plateforme de gestion (produits, stock, factures, réclamations et utilisateurs) construite sur une architecture **microservices** avec **Spring Boot**, **Node.js/Express**, **Laravel**, **Vue.js** et **MySQL**, reliés par **Eureka** (service discovery) et un **API Gateway** (Spring Cloud Gateway).

---

## Architecture

```
                          ┌─────────────┐
                          │  Vue.js     │
                          │  :5173      │
                          └──────┬──────┘
                                 │
                          ┌──────▼──────┐
                          │ API Gateway │  Spring Cloud Gateway :8085
                          └──────┬──────┘
                                 │  (lb:// via Eureka)
        ┌────────────┬───────────┼────────────┬─────────────┐
        │            │           │            │             │
 ┌──────▼─────┐ ┌────▼─────┐ ┌───▼──────┐ ┌───▼──────┐ ┌────▼──────┐
 │   Auth     │ │Reclamation│ │ Products │ │ Facture  │ │  Eureka   │
 │ SpringBoot │ │ SpringBoot│ │ Express  │ │ Laravel  │ │ :8761     │
 │   :8081    │ │   :8084   │ │  :3000   │ │  :8000   │ │           │
 └──────┬─────┘ └─────┬─────┘ └────┬─────┘ └────┬─────┘ └───────────┘
        │             │            │            │
        └─────────────┴────────────┴────────────┘
                                 │
                        ┌────────▼────────┐
                        │  MySQL 8 :3307  │
                        │ auth_db         │
                        │ reclamation_db  │
                        │ products_db     │
                        │ microservice_facture │
                        └─────────────────┘
```

> **Toutes les requêtes API passent par l'API Gateway sur `http://localhost:8085`.**
> Le frontend et les microservices sont enregistrés auprès d'Eureka pour la découverte de services.

---

## Stack technique

| Composant | Technologie | Port |
|---|---|---|
| Service discovery | Spring Boot 3.5 / Netflix Eureka | `8761` |
| API Gateway | Spring Cloud Gateway + JWT | `8085` |
| Auth & Utilisateurs | Spring Boot 3.3 (JPA, Spring Security, JWT) | `8081` |
| Réclamations | Spring Boot 3.3 (JPA) | `8084` |
| Produits / Stock | Node.js + Express 5 + MySQL2 | `3000` |
| Facturation | Laravel (PHP) | `8000` |
| Frontend | Vue 3 + Vite + Tailwind CSS | `5173` |
| Base de données | MySQL 8 | `3307` (hôte) / `3306` (conteneur) |

---

## Structure du dépôt

```
projectmicro/
├─ APIGateway/              # API Gateway Spring Cloud + filtre JWT
├─ eureka-server/           # Serveur Eureka (service discovery)
├─ microserviceauth/        # Auth + gestion des utilisateurs/rôles
├─ reclamation-service/     # Gestion des réclamations
├─ microservice-products/   # Produits, types, emplacements, historique (Express)
├─ microservice-facture/    # Facturation (Laravel)
├─ vue-project/             # Frontend Vue 3
├─ databases/               # Scripts SQL d'initialisation (4 bases)
└─ docker-compose.yml       # Orchestration complète
```

---

## Démarrage rapide (Docker)

La méthode la plus simple : tout est orchestré par `docker-compose`.

```bash
# À la racine du dépôt
docker compose up --build
```

Une fois les conteneurs démarrés :

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API Gateway | http://localhost:8085 |
| Eureka Dashboard | http://localhost:8761 |
| Facturation (Laravel) | http://localhost:8000 |

> Les bases de données MySQL sont créées automatiquement à partir des scripts `.sql` du dossier `databases/`.

---

## Démarrage manuel (développement)

L'ordre de lancement est **important** :

1. **MySQL** — démarrer une instance MySQL 8 et exécuter les scripts de `databases/`.
2. **Eureka Server**
   ```bash
   cd eureka-server && ./mvnw spring-boot:run
   ```
3. **Auth Service**
   ```bash
   cd microserviceauth && ./mvnw spring-boot:run
   ```
4. **Reclamation Service**
   ```bash
   cd reclamation-service && ./mvnw spring-boot:run
   ```
5. **API Gateway**
   ```bash
   cd APIGateway && ./mvnw spring-boot:run
   ```
6. **Products Service (Express)**
   ```bash
   cd microservice-products && npm install && npm start
   ```
7. **Facture Service (Laravel)**
   ```bash
   cd microservice-facture
   composer install
   php artisan serve
   ```
8. **Frontend (Vue)**
   ```bash
   cd vue-project && npm install && npm run dev
   ```

> ⚠️ En mode manuel local, adapter les URL `mysql-db` / `eureka-server` des fichiers `application.properties` vers `localhost` selon votre environnement.

---

## Compte par défaut

Au premier démarrage, l'`Auth Service` crée automatiquement un administrateur :

| Champ | Valeur |
|---|---|
| Utilisateur | `admin` |
| Mot de passe | `123456` |
| Email | `admin@gmail.com` |

Rôles gérés : `ADMIN`, `VENDEUR`, `GESTIONNAIRE_STOCK`.

---

## Aperçu des API (via la Gateway `:8085`)

| Préfixe | Service cible |
|---|---|
| `/auth/**` | Auth Service — `POST /auth/login` |
| `/users/**` | Auth Service — CRUD utilisateurs |
| `/reclamations/**` | Reclamation Service — création, liste, changement d'état |
| `/api/products/**` | Products Service — CRUD produits & recherche |
| `/api/product-types/**` | Products Service — types de produits |
| `/api/product-locations/**` | Products Service — emplacements |
| `/api/historique/**` | Products Service — historique des actions |
| `/api/factures/**` | Facture Service — CRUD factures |

> L'authentification se fait par **JWT** : récupérez le token via `POST /auth/login`, puis envoyez-le dans l'en-tête `Authorization: Bearer <token>`.
> Pour tester avec Postman, référez-vous à `APIGateway/src/main/resources/application.properties` (routes) et `APIGateway/.../security/JwtAuthFilter.java` (règles JWT).

---

## Notes

- Le JWT est généré par l'Auth Service et validé par l'API Gateway (`JwtAuthFilter`).
- Les 4 bases MySQL sont initialisées depuis `databases/` : `auth_db`, `reclamation_db`, `products_db`, `microservice_facture`.
- Le service de facturation doit être lancé via `php artisan serve` au moins une fois pour l'accès direct à sa base.

---

## Licence

Projet académique — usage pédagogique.
