import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdCreate from './AdCreate'

const mockNavigate = vi.fn()

const campaignsHook = vi.hoisted(() => ({
  data: [{ id: 1, name: 'Camp 1', status: 'DRAFT', description: 'Desc', createdAt: '2024-01-01' }],
}))

vi.mock('../hooks/useCampaigns', () => ({
  useCampaigns: () => ({ data: campaignsHook.data }),
}))

vi.mock('../hooks/useAds', () => ({
  useCreateAd: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUploadMedia: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useGenerateCopy: () => ({ mutateAsync: vi.fn(), isPending: false }),
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
      React.createElement(MemoryRouter, null, React.createElement(AdCreate))
    )
  )
}

describe('AdCreate page', () => {
  it('renderiza wizard paso 1 con título', () => {
    renderPage()
    expect(screen.getByText('Crear Anuncio')).toBeInTheDocument()
    expect(screen.getByText('Detalles del anuncio')).toBeInTheDocument()
  })

  it('muestra select de campañas con opciones', () => {
    renderPage()
    const select = document.querySelector('select#campaign') as HTMLSelectElement
    expect(select).toBeInTheDocument()
    expect(select.options.length).toBeGreaterThan(1)
  })

  it('muestra mensaje cuando no hay campañas disponibles', () => {
    campaignsHook.data = []
    renderPage()
    expect(screen.getByText('No hay campañas disponibles. Crea una primero en la sección Campañas.')).toBeInTheDocument()
  })

  it('muestra botón de continuar a archivos', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /continuar a archivos/i })).toBeInTheDocument()
  })

  it('botón de continuar deshabilitado sin campaña seleccionada', () => {
    renderPage()
    const btn = screen.getByRole('button', { name: /continuar a archivos/i })
    expect(btn).toBeDisabled()
  })
})
