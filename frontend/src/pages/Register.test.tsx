import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Register from './Register'

vi.mock('../hooks/useAuth', () => ({
  useRegister: () => ({ mutate: vi.fn(), isPending: false, isError: false, error: null }),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient },
      React.createElement(MemoryRouter, null, React.createElement(Register))
    )
  )
}

describe('Register page', () => {
  it('renderiza título y descripción', () => {
    renderPage()
    expect(screen.getByText('Generador de Publicidad')).toBeInTheDocument()
    expect(screen.getByText('Crea tu cuenta gratuita')).toBeInTheDocument()
  })

  it('renderiza link a login', () => {
    renderPage()
    const link = screen.getByRole('link', { name: /inicia sesión/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/login')
  })
})
