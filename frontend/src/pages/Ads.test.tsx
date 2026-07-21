import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Ads from './Ads'

const mockNavigate = vi.fn()

const adsHook = vi.hoisted(() => ({
  data: [],
  isLoading: false,
}))

vi.mock('../hooks/useAds', () => ({
  useMyAds: () => ({ data: adsHook.data, isLoading: adsHook.isLoading }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => {
  vi.clearAllMocks()
  adsHook.data = []
  adsHook.isLoading = false
})

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient },
      React.createElement(MemoryRouter, null, React.createElement(Ads))
    )
  )
}

describe('Ads page', () => {
  it('muestra spinner de carga cuando isLoading', () => {
    adsHook.isLoading = true
    adsHook.data = undefined

    renderPage()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('muestra estado vacío cuando no hay ads', () => {
    renderPage()
    expect(screen.getByText('No hay anuncios todavía')).toBeInTheDocument()
  })

  it('muestra lista de ads cuando hay datos', () => {
    adsHook.data = [
      { id: 1, title: 'Ad 1', status: 'DRAFT', description: 'Desc', media: [], campaignName: 'Camp', campaignId: 1, createdAt: '2024-01-01' },
    ]

    renderPage()
    expect(screen.getByText('Ad 1')).toBeInTheDocument()
  })

  it('navega a nuevo anuncio al hacer click en Nuevo Anuncio', () => {
    renderPage()
    const btn = screen.getByRole('button', { name: /nuevo anuncio/i })
    btn.click()
    expect(mockNavigate).toHaveBeenCalledWith('/ads/new')
  })
})
