// // src/store/userStore.js
// import { reactive, readonly } from 'vue'

// export const userStore = reactive({
//   // Utilisateurs initiaux
//   users: [
//     {
//       id: 1,
//       nom: 'Admin Principal',
//       email: 'admin@boutique.com',
//       password: 'admin123',
//       role: 'admin',
//       dateCreation: '2024-01-01',
//       actif: true
//     },
//     {
//       id: 2,
//       nom: 'Vendeur 1',
//       email: 'vendeur1@boutique.com',
//       password: 'vendeur123',
//       role: 'vendeur',
//       dateCreation: '2024-01-15',
//       actif: true
//     },
//     {
//       id: 3,
//       nom: 'Gestionnaire Stock',
//       email: 'stock@boutique.com',
//       password: 'stock123',
//       role: 'gestionnaire_stock',
//       dateCreation: '2024-02-01',
//       actif: true
//     }
//   ],
  
//   // Utilisateur connecté
//   currentUser: null,
  
//   // Initialiser depuis localStorage
//   init() {
//     const savedUsers = localStorage.getItem('users')
//     if (savedUsers) {
//       this.users = JSON.parse(savedUsers)
//     } else {
//       this.saveToLocalStorage()
//     }
    
//     // Récupérer l'utilisateur connecté
//     const savedCurrentUser = localStorage.getItem('currentUser')
//     if (savedCurrentUser) {
//       this.currentUser = JSON.parse(savedCurrentUser)
//     }
//   },
  
//   // Sauvegarder dans localStorage
//   saveToLocalStorage() {
//     localStorage.setItem('users', JSON.stringify(this.users))
//   },
  
//   // Connexion
//   login(email, password) {
//     const user = this.users.find(u => 
//       u.email === email && u.password === password && u.actif
//     )
    
//     if (user) {
//       this.currentUser = { ...user }
//       localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
//       return { success: true, user }
//     }
    
//     return { success: false, message: 'Email ou mot de passe incorrect' }
//   },
  
//   // Déconnexion
//   logout() {
//     this.currentUser = null
//     localStorage.removeItem('currentUser')
//   },
  
//   // Ajouter un utilisateur
//   addUser(userData) {
//     const newUser = {
//       id: Date.now(),
//       ...userData,
//       dateCreation: new Date().toISOString().split('T')[0],
//       actif: true
//     }
    
//     this.users.push(newUser)
//     this.saveToLocalStorage()
//     return newUser
//   },
  
//   // Modifier un utilisateur
//   updateUser(id, userData) {
//     const index = this.users.findIndex(u => u.id === id)
//     if (index !== -1) {
//       this.users[index] = { ...this.users[index], ...userData }
//       this.saveToLocalStorage()
      
//       // Mettre à jour currentUser si c'est le même
//       if (this.currentUser && this.currentUser.id === id) {
//         this.currentUser = { ...this.users[index] }
//         localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
//       }
      
//       return true
//     }
//     return false
//   },
  
//   // Supprimer un utilisateur (désactiver)
//   deleteUser(id) {
//     const index = this.users.findIndex(u => u.id === id)
//     if (index !== -1) {
//       this.users[index].actif = false
//       this.saveToLocalStorage()
//       return true
//     }
//     return false
//   },
  
//   // Vérifier les permissions
//   hasPermission(requiredRole) {
//     if (!this.currentUser) return false
    
//     const roleHierarchy = {
//       'admin': ['admin', 'vendeur', 'gestionnaire_stock'],
//       'vendeur': ['vendeur'],
//       'gestionnaire_stock': ['gestionnaire_stock']
//     }
    
//     return roleHierarchy[this.currentUser.role]?.includes(requiredRole) || false
//   },
  
//   // Obtenir tous les utilisateurs (sauf mots de passe)
//   getAllUsers() {
//     return this.users.map(({ password, ...user }) => user)
//   },
  
//   // Obtenir un utilisateur par ID
//   getUserById(id) {
//     const user = this.users.find(u => u.id === id)
//     if (user) {
//       const { password, ...userWithoutPassword } = user
//       return userWithoutPassword
//     }
//     return null
//   }
// })

// // Initialiser le store
// userStore.init()

// export const useUserStore = () => userStore