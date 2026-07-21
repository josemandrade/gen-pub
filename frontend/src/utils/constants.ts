// ============================================================
// utils/constants.ts — Constantes globales de la aplicación
// ============================================================

// Base URL para llamadas al backend.
// En desarrollo (Vite proxy) usa '/api'.
// En Kubernetes se inyecta via config.js como window.__API_URL__.
export const API_BASE_URL = (window as any).__API_URL__ || '/api'

// Nombre de la clave en localStorage donde se guarda el JWT
export const TOKEN_KEY = 'auth_token'
