import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdDetail from './AdDetail'

const mockNavigate = vi.fn()

const adHook = vi.hoisted((): { data: unknown; isLoading: boolean } => ({
  data: undefined,
  isLoading: false,
}))

vi.mock('../hooks/useAds', () => ({
  useAd: () => ({ data: adHook.data, isLoading: adHook.isLoading }),
  useDeleteAd: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => {
  vi.clearAllMocks()
  adHook.data = undefined
  adHook.isLoading = false
})

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient },
      React.createElement(MemoryRouter, { initialEntries: ['/ads/1'] },
        React.createElement(Routes, null,
          React.createElement(Route, { path: '/ads/:id', element: React.createElement(AdDetail) })
        )
      )
    )
  )
}

describe('AdDetail page', () => {
  it('muestra spinner de carga', () => {
    adHook.isLoading = true
    renderPage()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('muestra anuncio no encontrado cuando ad es null', () => {
    adHook.data = null
    renderPage()
    expect(screen.getByText('Anuncio no encontrado')).toBeInTheDocument()
  })

  it('muestra detalle del ad con datos', () => {
    adHook.data = {
      id: 1, title: 'Mi Anuncio', status: 'DRAFT', description: 'Descripción del anuncio',
      media: [], campaignName: 'Camp 1', campaignId: 1, createdAt: '2024-01-01',
    }

    renderPage()
    expect(screen.getByText('Mi Anuncio')).toBeInTheDocument()
    expect(screen.getByText('Descripción del anuncio')).toBeInTheDocument()
    expect(screen.getByText('Borrador')).toBeInTheDocument()
  })

  it('muestra media cuando hay archivos', () => {
    adHook.data = {
      id: 1, title: 'Con Media', status: 'DRAFT', description: 'Desc',
      media: [{ id: 1, url: '/test.jpg', originalName: 'foto.jpg', mediaType: 'IMAGE', adId: 1, contentType: 'image/jpeg', size: 1000, createdAt: '2024-01-01' }],
      campaignName: 'Camp 1', campaignId: 1, createdAt: '2024-01-01',
    }

    renderPage()
    expect(screen.getByText('foto.jpg')).toBeInTheDocument()
  })

  it('muestra botón de editar', () => {
    adHook.data = {
      id: 1, title: 'Test', status: 'DRAFT', description: 'Desc',
      media: [], campaignName: 'Camp', campaignId: 1, createdAt: '2024-01-01',
    }

    renderPage()
    expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument()
  })
})
