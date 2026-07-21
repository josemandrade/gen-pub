import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './Login'

vi.mock('../hooks/useAuth', () => ({
  useLogin: () => ({ mutate: vi.fn(), isPending: false, isError: false, error: null }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient },
      React.createElement(MemoryRouter, null, React.createElement(Login))
    )
  )
}

describe('Login page', () => {
  it('renderiza título y descripción', () => {
    renderPage()
    expect(screen.getByText('Generador de Publicidad')).toBeInTheDocument()
    expect(screen.getByText('Inicia sesión para continuar')).toBeInTheDocument()
  })

  it('renderiza link a registro', () => {
    renderPage()
    const link = screen.getByRole('link', { name: /regístrate/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/register')
  })
})
