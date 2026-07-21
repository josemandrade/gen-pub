import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdEdit from './AdEdit'

const mockNavigate = vi.fn()

const adHook = vi.hoisted((): { data: unknown; isLoading: boolean } => ({
  data: undefined,
  isLoading: false,
}))

vi.mock('../hooks/useAds', () => ({
  useAd: () => ({ data: adHook.data, isLoading: adHook.isLoading }),
  useUpdateAd: () => ({ mutate: vi.fn(), isPending: false }),
  useUploadMedia: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteMedia: () => ({ mutate: vi.fn(), isPending: false }),
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
      React.createElement(MemoryRouter, { initialEntries: ['/ads/1/edit'] },
        React.createElement(Routes, null,
          React.createElement(Route, { path: '/ads/:id/edit', element: React.createElement(AdEdit) })
        )
      )
    )
  )
}

describe('AdEdit page', () => {
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

  it('muestra campos pre-llenados con datos del ad', () => {
    adHook.data = {
      id: 1, title: 'Título Existente', status: 'DRAFT', description: 'Descripción existente',
      media: [], campaignName: 'Camp', campaignId: 1, createdAt: '2024-01-01',
    }

    renderPage()
    expect(document.querySelector('#title')).toHaveValue('Título Existente')
  })

  it('muestra botón guardar', () => {
    adHook.data = {
      id: 1, title: 'Test', status: 'DRAFT', description: 'Desc',
      media: [], campaignName: 'Camp', campaignId: 1, createdAt: '2024-01-01',
    }

    renderPage()
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
  })
})
