import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const mockFns = {
  fetchAds: vi.fn(),
  fetchAd: vi.fn(),
  createAd: vi.fn(),
  updateAd: vi.fn(),
  deleteAd: vi.fn(),
  uploadMedia: vi.fn(),
  deleteMedia: vi.fn(),
  fetchMyAds: vi.fn(),
  generateCopy: vi.fn(),
}

vi.mock('../api/ads', () => mockFns)

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

describe('useAds hooks', () => {
  it('useAds(campaignId) ejecuta fetchAds', async () => {
    mockFns.fetchAds.mockResolvedValue([{ id: 1, title: 'Ad' }])

    const { useAds } = await import('./useAds')

    const { result } = renderHook(() => useAds(1), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockFns.fetchAds).toHaveBeenCalledWith(1)
  })

  it('useAds(null) no ejecuta fetchAds', async () => {
    const { useAds } = await import('./useAds')

    renderHook(() => useAds(null), { wrapper: createWrapper() })

    expect(mockFns.fetchAds).not.toHaveBeenCalled()
  })

  it('useAd(id) ejecuta fetchAd', async () => {
    mockFns.fetchAd.mockResolvedValue({ id: 1, title: 'Ad' })

    const { useAd } = await import('./useAds')

    const { result } = renderHook(() => useAd(1), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockFns.fetchAd).toHaveBeenCalledWith(1)
  })

  it('useAd(null) no ejecuta fetchAd', async () => {
    const { useAd } = await import('./useAds')

    renderHook(() => useAd(null), { wrapper: createWrapper() })

    expect(mockFns.fetchAd).not.toHaveBeenCalled()
  })

  it('useCreateAd ejecuta createAd', async () => {
    mockFns.createAd.mockResolvedValue({ id: 1 })

    const { useCreateAd } = await import('./useAds')

    const { result } = renderHook(() => useCreateAd(), { wrapper: createWrapper() })
    result.current.mutate({ campaignId: 1, title: 'Ad' })

    await waitFor(() => expect(mockFns.createAd).toHaveBeenCalledWith({ campaignId: 1, title: 'Ad' }))
  })

  it('useUpdateAd ejecuta updateAd', async () => {
    mockFns.updateAd.mockResolvedValue({ id: 1 })

    const { useUpdateAd } = await import('./useAds')

    const { result } = renderHook(() => useUpdateAd(), { wrapper: createWrapper() })
    result.current.mutate({ id: 1, data: { title: 'Updated' } })

    await waitFor(() => expect(mockFns.updateAd).toHaveBeenCalledWith(1, { title: 'Updated' }))
  })

  it('useDeleteAd ejecuta deleteAd', async () => {
    mockFns.deleteAd.mockResolvedValue(undefined)

    const { useDeleteAd } = await import('./useAds')

    const { result } = renderHook(() => useDeleteAd(), { wrapper: createWrapper() })
    result.current.mutate(1)

    await waitFor(() => expect(mockFns.deleteAd).toHaveBeenCalledWith(1))
  })

  it('useUploadMedia ejecuta uploadMedia', async () => {
    mockFns.uploadMedia.mockResolvedValue({ id: 1 })

    const { useUploadMedia } = await import('./useAds')

    const { result } = renderHook(() => useUploadMedia(), { wrapper: createWrapper() })
    result.current.mutate({ adId: 1, files: [] })

    await waitFor(() => expect(mockFns.uploadMedia).toHaveBeenCalledWith(1, []))
  })

  it('useDeleteMedia ejecuta deleteMedia', async () => {
    mockFns.deleteMedia.mockResolvedValue(undefined)

    const { useDeleteMedia } = await import('./useAds')

    const { result } = renderHook(() => useDeleteMedia(), { wrapper: createWrapper() })
    result.current.mutate(1)

    await waitFor(() => expect(mockFns.deleteMedia).toHaveBeenCalledWith(1))
  })

  it('useMyAds ejecuta fetchMyAds', async () => {
    mockFns.fetchMyAds.mockResolvedValue([{ id: 1 }])

    const { useMyAds } = await import('./useAds')

    const { result } = renderHook(() => useMyAds(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockFns.fetchMyAds).toHaveBeenCalled()
  })

  it('useGenerateCopy ejecuta generateCopy', async () => {
    mockFns.generateCopy.mockResolvedValue({ title: 'Copy', description: 'Desc', imageSuggestions: [] })

    const { useGenerateCopy } = await import('./useAds')

    const { result } = renderHook(() => useGenerateCopy(), { wrapper: createWrapper() })
    result.current.mutate({ prompt: 'create', mediaIds: [] })

    await waitFor(() => expect(mockFns.generateCopy).toHaveBeenCalledWith({ prompt: 'create', mediaIds: [] }))
  })
})
