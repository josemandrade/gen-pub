// ============================================================
// store/authStore.ts — Estado global de autenticación (Zustand)
// ============================================================
// Zustand es una librería minimalista para manejar estado global.
// Es como un "contexto" de React pero más simple y eficiente.
//
// Este store guarda:
//   - user: datos del usuario logueado
//   - token: JWT para autenticar peticiones
//   - isAuthenticated: ¿hay sesión activa?
//   - isVerifying: ¿está verificando el token al iniciar?
//
// Persiste el token en localStorage para que al recargar
// la página no se pierda la sesión.

import { create } from 'zustand'
import type { User } from '../types'
import { TOKEN_KEY } from '../utils/constants'
import client from '../api/client'

// Define la forma (interfaz) del store
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isVerifying: boolean
  setAuth: (user: User, token: string) => void
  setUser: (user: User) => void
  logout: () => void
  loadFromStorage: () => void
  verifyToken: () => Promise<void>
}

// create<AuthState>((set, get) => ({...}))
//   - set: actualiza el estado parcialmente
//   - get: lee el estado actual
export const useAuthStore = create<AuthState>((set, get) => ({
  // --- Estado inicial ---
  user: null,
  token: null,
  isAuthenticated: false,
  isVerifying: false,

  // --- Acciones (modifican el estado) ---

  // Guarda usuario y token tras login/registro exitoso
  setAuth: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token)   // persiste en localStorage
    set({ user, token, isAuthenticated: true })
  },

  // Solo actualiza datos del usuario (sin cambiar token)
  setUser: (user) => {
    set({ user })
  },

  // Cierra sesión: limpia localStorage y estado
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({ user: null, token: null, isAuthenticated: false })
  },

  // Al recargar la página, recupera el token guardado
  loadFromStorage: () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      set({ token, isAuthenticated: true })
    }
  },

  // Verifica si el token guardado sigue siendo válido
  // llama a GET /api/auth/me, si falla → el token expiró → logout
  verifyToken: async () => {
    const token = get().token || localStorage.getItem(TOKEN_KEY)
    if (!token) {
      set({ isVerifying: false, isAuthenticated: false })
      return
    }
    set({ token, isAuthenticated: true, isVerifying: true })
    try {
      const { data } = await client.get('/auth/me')
      set({ user: data, isVerifying: false })
    } catch {
      // Token inválido o expirado
      localStorage.removeItem(TOKEN_KEY)
      set({ user: null, token: null, isAuthenticated: false, isVerifying: false })
    }
  },
}))
