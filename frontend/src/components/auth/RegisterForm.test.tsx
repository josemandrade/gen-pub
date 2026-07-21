import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const registerHook = vi.hoisted(() => ({
  mutate: vi.fn(),
  isPending: false,
  isError: false,
  error: null,
}))

vi.mock('../../hooks/useAuth', () => ({
  useRegister: () => ({ ...registerHook }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  registerHook.mutate = vi.fn()
  registerHook.isPending = false
  registerHook.isError = false
  registerHook.error = null
})

describe('RegisterForm', () => {
  it('renderiza inputs name, email, password y botón submit', async () => {
    const { RegisterForm } = await import('./RegisterForm')
    render(React.createElement(RegisterForm))

    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('muestra error si name < 2 caracteres', async () => {
    const user = userEvent.setup()
    const { RegisterForm } = await import('./RegisterForm')
    render(React.createElement(RegisterForm))

    await user.type(screen.getByLabelText('Nombre'), 'A')
    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), '123456')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 2 caracteres')).toBeInTheDocument()
    })
  })

  it('muestra error si password < 6 caracteres', async () => {
    const user = userEvent.setup()
    const { RegisterForm } = await import('./RegisterForm')
    render(React.createElement(RegisterForm))

    await user.type(screen.getByLabelText('Nombre'), 'Test')
    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), '123')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument()
    })
  })

  it('llama a mutate con datos correctos', async () => {
    const user = userEvent.setup()
    const { RegisterForm } = await import('./RegisterForm')
    render(React.createElement(RegisterForm))

    await user.type(screen.getByLabelText('Nombre'), 'Test User')
    await user.type(screen.getByLabelText('Email'), 'test@test.com')
    await user.type(screen.getByLabelText('Contraseña'), 'password123')
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }))

    await waitFor(() => {
      expect(registerHook.mutate).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      })
    })
  })

  it('muestra error del servidor', async () => {
    registerHook.isError = true
    registerHook.error = new Error('Email ya registrado')

    const { RegisterForm } = await import('./RegisterForm')
    render(React.createElement(RegisterForm))

    expect(screen.getByText('Email ya registrado')).toBeInTheDocument()
  })

  it('botón deshabilitado durante isLoading', async () => {
    registerHook.isPending = true

    const { RegisterForm } = await import('./RegisterForm')
    render(React.createElement(RegisterForm))

    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeDisabled()
  })
})
