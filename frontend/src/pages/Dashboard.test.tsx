import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from './Dashboard'

const mockNavigate = vi.fn()

vi.mock('../store/authStore', () => ({
  useAuthStore: (selector: (state: unknown) => unknown) => selector({
    user: { id: 1, name: 'Test User', email: 'test@test.com', role: 'EDITOR' },
    isAuthenticated: true,
  }),
}))

vi.mock('../hooks/useCampaigns', () => ({
  useCampaigns: () => ({
    data: [{ id: 1, name: 'Camp 1', status: 'DRAFT', description: 'A campaign', createdAt: '2024-01-01' }],
    isLoading: false,
  }),
}))

vi.mock('../hooks/useAds', () => ({
  useMyAds: () => ({
    data: [
      { id: 1, title: 'Ad 1', status: 'DRAFT', description: 'Desc', media: [], campaignName: 'Camp 1', campaignId: 1, createdAt: '2024-01-01' },
      { id: 2, title: 'Ad 2', status: 'APPROVED', description: 'Desc 2', media: [], campaignName: 'Camp 1', campaignId: 1, createdAt: '2024-01-02' },
    ],
    isLoading: false,
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => {
  vi.clearAllMocks()
})

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient },
      React.createElement(MemoryRouter, null, React.createElement(Dashboard))
    )
  )
}

describe('Dashboard page', () => {
  it('renderiza encabezado de bienvenida con nombre del usuario', () => {
    renderPage()
    expect(screen.getByText(/Buenos días/)).toBeInTheDocument()
    expect(screen.getByText(/Test/)).toBeInTheDocument()
  })

  it('muestra stats cards', () => {
    renderPage()
    expect(screen.getByText('Campañas')).toBeInTheDocument()
    expect(screen.getByText('Anuncios')).toBeInTheDocument()
    expect(screen.getByText('Pendientes')).toBeInTheDocument()
  })

  it('muestra cards de acción', () => {
    renderPage()
    expect(screen.getByText('Crea un anuncio')).toBeInTheDocument()
    expect(screen.getByText('Gestiona campañas')).toBeInTheDocument()
  })

  it('navega al hacer click en Nuevo Anuncio', () => {
    renderPage()
    const btn = screen.getByRole('button', { name: /nuevo anuncio/i })
    btn.click()
    expect(mockNavigate).toHaveBeenCalledWith('/ads/new')
  })

  it('navega al hacer click en Ir a Campañas', () => {
    renderPage()
    const btn = screen.getByRole('button', { name: /ir a campañas/i })
    btn.click()
    expect(mockNavigate).toHaveBeenCalledWith('/campaigns')
  })
})
