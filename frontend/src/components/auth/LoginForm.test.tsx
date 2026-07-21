import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const loginHook = vi.hoisted(() => ({
  mutate: vi.fn(),
  isPending: false,
  isError: false,
  error: null,
}))

vi.mock('../../hooks/useAuth', () => ({
  useLogin: () => ({ ...loginHook }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  loginHook.mutate = vi.fn()
  loginHook.isPending = false
  loginHook.isError = false
  loginHook.error = null
})

describe('LoginForm', () => {
  it('renderiza inputs email, password y botón submit', async () => {
    const { LoginForm } = await import('./LoginForm')
    render(React.createElement(LoginForm))

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('muestra errores de validación si campos vacíos', async () => {
    const user = userEvent.setup()
    const { LoginForm } = await import('./LoginForm')
    render(React.createElement(LoginForm))

    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
      expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument()
    })
  })

  it('llama a mutate con datos del formulario', async () => {
    const user = userEvent.setup()
    const { LoginForm } = await import('./LoginForm')
    render(React.createElement(LoginForm))

    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(loginHook.mutate).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
    })
  })

  it('muestra error del servidor cuando isError', async () => {
    loginHook.isError = true
    loginHook.error = new Error('Credenciales inválidas')

    const { LoginForm } = await import('./LoginForm')
    render(React.createElement(LoginForm))

    expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument()
  })

  it('botón se deshabilita durante isLoading', async () => {
    loginHook.isPending = true

    const { LoginForm } = await import('./LoginForm')
    render(React.createElement(LoginForm))

    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeDisabled()
  })

  it('input de password tiene type password', async () => {
    const { LoginForm } = await import('./LoginForm')
    render(React.createElement(LoginForm))

    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password')
  })
})
