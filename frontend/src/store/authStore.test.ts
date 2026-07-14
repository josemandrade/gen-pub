import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from './authStore'
import { TOKEN_KEY } from '../utils/constants'

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isVerifying: false,
  })
})

describe('authStore', () => {
  describe('setAuth', () => {
    it('guarda usuario y token en el store', () => {
      const user = { id: 1, name: 'Test', email: 'test@test.com', role: 'EDITOR' as const }
      useAuthStore.getState().setAuth(user, 'token-123')
      const state = useAuthStore.getState()
      expect(state.user).toEqual(user)
      expect(state.token).toBe('token-123')
      expect(state.isAuthenticated).toBe(true)
    })

    it('persiste el token en localStorage', () => {
      const user = { id: 1, name: 'Test', email: 'test@test.com', role: 'EDITOR' as const }
      useAuthStore.getState().setAuth(user, 'token-456')
      expect(localStorage.getItem(TOKEN_KEY)).toBe('token-456')
    })
  })

  describe('setUser', () => {
    it('actualiza solo el usuario', () => {
      const user = { id: 1, name: 'Test', email: 'test@test.com', role: 'EDITOR' as const }
      useAuthStore.getState().setAuth(user, 'token')
      useAuthStore.getState().setUser({ ...user, name: 'Updated' })
      expect(useAuthStore.getState().user?.name).toBe('Updated')
    })
  })

  describe('logout', () => {
    it('limpia usuario, token y autenticación', () => {
      const user = { id: 1, name: 'Test', email: 'test@test.com', role: 'EDITOR' as const }
      useAuthStore.getState().setAuth(user, 'token')
      useAuthStore.getState().logout()
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('remueve el token de localStorage', () => {
      localStorage.setItem(TOKEN_KEY, 'token')
      useAuthStore.getState().logout()
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    })
  })

  describe('loadFromStorage', () => {
    it('carga el token desde localStorage', () => {
      localStorage.setItem(TOKEN_KEY, 'stored-token')
      useAuthStore.getState().loadFromStorage()
      const state = useAuthStore.getState()
      expect(state.token).toBe('stored-token')
      expect(state.isAuthenticated).toBe(true)
    })

    it('no cambia el estado si no hay token', () => {
      useAuthStore.getState().loadFromStorage()
      const state = useAuthStore.getState()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  describe('verifyToken', () => {
    it('marca isVerifying false si no hay token', async () => {
      await useAuthStore.getState().verifyToken()
      expect(useAuthStore.getState().isVerifying).toBe(false)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})
