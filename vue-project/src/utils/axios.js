import axios from 'axios'

// Default API for Spring Boot services (through Gateway)
const api = axios.create({
  baseURL: 'http://localhost:8085',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Separate API for Laravel Facture service (bypass Gateway to avoid CORS issues)
const factureApi = axios.create({
  baseURL: 'http://localhost:8000', // Direct to Laravel
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token automatically on every request for BOTH APIs
const addTokenInterceptor = config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

api.interceptors.request.use(addTokenInterceptor)
factureApi.interceptors.request.use(addTokenInterceptor)

// Export both
export default api
export { factureApi }