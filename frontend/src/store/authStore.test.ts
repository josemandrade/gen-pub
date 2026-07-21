import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'
import { TOKEN_KEY } from '../utils/constants'

const mockGet = vi.fn()

vi.mock('../api/client', () => ({
  default: {
    get: (...args: any[]) => mockGet(...args),
  },
}))

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
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

    it('marca autenticado y carga usuario en éxito', async () => {
      localStorage.setItem(TOKEN_KEY, 'valid-token')
      const userData = { id: 1, name: 'Test', email: 'test@test.com', role: 'EDITOR' }
      mockGet.mockResolvedValue({ data: userData })

      await useAuthStore.getState().verifyToken()

      const state = useAuthStore.getState()
      expect(state.isVerifying).toBe(false)
      expect(state.isAuthenticated).toBe(true)
      expect(state.user).toEqual(userData)
      expect(state.token).toBe('valid-token')
    })

    it('limpia sesión si el token es inválido', async () => {
      localStorage.setItem(TOKEN_KEY, 'expired-token')
      mockGet.mockRejectedValue(new Error('401 Unauthorized'))

      await useAuthStore.getState().verifyToken()

      const state = useAuthStore.getState()
      expect(state.isVerifying).toBe(false)
      expect(state.isAuthenticated).toBe(false)
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    })
  })
})
