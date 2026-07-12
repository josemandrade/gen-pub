// ============================================================
// api/client.ts — Cliente HTTP global (Axios)
// ============================================================
// Axios es una librería para hacer peticiones HTTP.
// Este archivo configura una instancia compartida que:
//   1. Apunta al backend (baseURL: '/api')
//   2. Agrega el token JWT automáticamente a cada petición
//   3. Redirige al login si el backend responde con 401

import axios from 'axios'
import { TOKEN_KEY } from '../utils/constants'

// Crear instancia de Axios con configuración base
const client = axios.create({
  baseURL: '/api',                          // todas las rutas empiezan con /api
  headers: { 'Content-Type': 'application/json' },
})

// INTERCEPTOR DE PETICIONES — se ejecuta antes de cada request
// Toma el token del localStorage y lo agrega como header
// Authorization: Bearer <token>
client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// INTERCEPTOR DE RESPUESTAS — se ejecuta después de cada response
// Si el backend devuelve 401 (No autorizado), el token expiró
// o es inválido → limpia el storage y redirige al login
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default client
