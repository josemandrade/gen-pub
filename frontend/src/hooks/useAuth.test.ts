import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const mockSetAuth = vi.fn()
const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../store/authStore', () => ({
  useAuthStore: (selector: any) => selector({ setAuth: mockSetAuth }),
}))

const { mockLogin, mockRegister } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockRegister: vi.fn(),
}))

vi.mock('../api/auth', () => ({
  login: mockLogin,
  register: mockRegister,
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useAuth hooks', () => {
  it('useLogin llama a login y setAuth + navigate en éxito', async () => {
    mockLogin.mockResolvedValue({
      token: 'jwt',
      user: { id: 1, name: 'Test', email: 'test@test.com', role: 'EDITOR' },
    })

    const { useLogin } = await import('./useAuth')
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    result.current.mutate({ email: 'test@test.com', password: 'pass123' })

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'pass123' })
    })
  })

  it('useRegister llama a register y setAuth + navigate en éxito', async () => {
    mockRegister.mockResolvedValue({
      token: 'jwt',
      user: { id: 1, name: 'Test', email: 'test@test.com', role: 'EDITOR' },
    })

    const { useRegister } = await import('./useAuth')
    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() })

    result.current.mutate({ name: 'Test', email: 'test@test.com', password: 'pass123' })

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({ name: 'Test', email: 'test@test.com', password: 'pass123' })
    })
  })

  it('useLogin no llama a setAuth ni navigate en error', async () => {
    mockLogin.mockRejectedValue(new Error('Credenciales inválidas'))

    const { useLogin } = await import('./useAuth')
    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })

    result.current.mutate({ email: 'test@test.com', password: 'wrong' })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockSetAuth).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('useRegister no llama a setAuth ni navigate en error', async () => {
    mockRegister.mockRejectedValue(new Error('Email ya registrado'))

    const { useRegister } = await import('./useAuth')
    const { result } = renderHook(() => useRegister(), { wrapper: createWrapper() })

    result.current.mutate({ name: 'Test', email: 'test@test.com', password: 'pass123' })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockSetAuth).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
