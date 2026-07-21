import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Campaigns from './Campaigns'

const campaignsHook = vi.hoisted((): { data: unknown; isLoading: boolean } => ({
  data: [],
  isLoading: false,
}))

const createCampaignHook = vi.hoisted(() => ({
  mutate: vi.fn(),
  isPending: false,
}))

vi.mock('../hooks/useCampaigns', () => ({
  useCampaigns: () => ({ data: campaignsHook.data, isLoading: campaignsHook.isLoading }),
  useCreateCampaign: () => ({ mutate: createCampaignHook.mutate, isPending: createCampaignHook.isPending }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  campaignsHook.data = []
  campaignsHook.isLoading = false
  createCampaignHook.mutate = vi.fn()
  createCampaignHook.isPending = false
})

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    React.createElement(QueryClientProvider, { client: queryClient },
      React.createElement(MemoryRouter, null, React.createElement(Campaigns))
    )
  )
}

describe('Campaigns page', () => {
  it('muestra spinner de carga cuando isLoading', () => {
    campaignsHook.isLoading = true
    campaignsHook.data = undefined

    renderPage()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('muestra estado vacío cuando no hay campañas', () => {
    renderPage()
    expect(screen.getByText('No hay campañas aún')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crear primera campaña/i })).toBeInTheDocument()
  })

  it('muestra lista de campañas como cards', () => {
    campaignsHook.data = [{ id: 1, name: 'Mi Campaña', status: 'DRAFT', description: 'Desc', createdAt: '2024-01-01' }]

    renderPage()
    expect(screen.getByText('Mi Campaña')).toBeInTheDocument()
  })

  it('muestra formulario al clickear Nueva Campaña', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: /nueva campaña/i }))
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Descripción')).toBeInTheDocument()
  })

  it('crea campaña al llenar formulario y hacer click en Crear Campaña', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /nueva campaña/i }))
    await user.type(screen.getByLabelText('Nombre'), 'Mi Nueva Campaña')
    await user.click(screen.getByRole('button', { name: /crear campaña/i }))

    expect(createCampaignHook.mutate).toHaveBeenCalledWith(
      { name: 'Mi Nueva Campaña', description: '' },
      expect.any(Object)
    )
  })
})
