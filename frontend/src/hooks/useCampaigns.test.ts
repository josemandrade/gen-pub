import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const mockFetchCampaigns = vi.fn()
const mockCreateCampaign = vi.fn()

vi.mock('../api/campaigns', () => ({
  fetchCampaigns: (...args: any[]) => mockFetchCampaigns(...args),
  createCampaign: (...args: any[]) => mockCreateCampaign(...args),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useCampaigns hooks', () => {
  it('useCampaigns ejecuta fetchCampaigns', async () => {
    mockFetchCampaigns.mockResolvedValue([{ id: 1, name: 'Camp', status: 'DRAFT' }])

    const { useCampaigns } = await import('./useCampaigns')

    const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockFetchCampaigns).toHaveBeenCalled()
    expect(result.current.data).toHaveLength(1)
  })

  it('useCreateCampaign ejecuta createCampaign e invalida queries', async () => {
    mockCreateCampaign.mockResolvedValue({ id: 1, name: 'New' })

    const { useCreateCampaign } = await import('./useCampaigns')

    const { result } = renderHook(() => useCreateCampaign(), { wrapper: createWrapper() })

    result.current.mutate({ name: 'New Campaign' })

    await waitFor(() => {
      expect(mockCreateCampaign).toHaveBeenCalledWith({ name: 'New Campaign' })
    })
  })

  it('useCampaigns maneja estado de error', async () => {
    mockFetchCampaigns.mockRejectedValue(new Error('Network error'))

    const { useCampaigns } = await import('./useCampaigns')
    const { result } = renderHook(() => useCampaigns(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockFetchCampaigns).toHaveBeenCalled()
  })

  it('useCreateCampaign invalida cache de campaigns al crear', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    mockCreateCampaign.mockResolvedValue({ id: 1, name: 'New' })

    const { useCreateCampaign } = await import('./useCampaigns')
    const { result } = renderHook(() => useCreateCampaign(), {
      wrapper: ({ children }) => React.createElement(QueryClientProvider, { client: queryClient }, children),
    })

    result.current.mutate({ name: 'New Campaign' })

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['campaigns'] })
    })
  })
})
