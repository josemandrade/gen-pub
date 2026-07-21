import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockAd = { id: 1, campaignId: 1, campaignName: 'Camp', title: 'Ad', description: 'Desc', status: 'DRAFT', media: [], createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
const mockCopy = { title: 'Copy', description: 'Desc', imageSuggestions: ['kw'] }

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ads API', () => {
  it('fetchAds() hace GET /ads con campaignId', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.get).mockResolvedValue({ data: [mockAd] })
    const { fetchAds } = await import('./ads')

    const result = await fetchAds(1)

    expect(client.get).toHaveBeenCalledWith('/ads', { params: { campaignId: 1 } })
    expect(result).toEqual([mockAd])
  })

  it('fetchAd() hace GET /ads/:id', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.get).mockResolvedValue({ data: mockAd })
    const { fetchAd } = await import('./ads')

    const result = await fetchAd(1)

    expect(client.get).toHaveBeenCalledWith('/ads/1')
    expect(result).toEqual(mockAd)
  })

  it('createAd() hace POST /ads', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.post).mockResolvedValue({ data: mockAd })
    const { createAd } = await import('./ads')

    const result = await createAd({ campaignId: 1, title: 'Ad', description: 'Desc' })

    expect(client.post).toHaveBeenCalledWith('/ads', { campaignId: 1, title: 'Ad', description: 'Desc' })
    expect(result).toEqual(mockAd)
  })

  it('updateAd() hace PUT /ads/:id', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.put).mockResolvedValue({ data: mockAd })
    const { updateAd } = await import('./ads')

    const result = await updateAd(1, { title: 'Updated', description: 'New', status: 'GENERATED' })

    expect(client.put).toHaveBeenCalledWith('/ads/1', { title: 'Updated', description: 'New', status: 'GENERATED' })
    expect(result).toEqual(mockAd)
  })

  it('deleteAd() hace DELETE /ads/:id', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.delete).mockResolvedValue({})
    const { deleteAd } = await import('./ads')

    await deleteAd(1)

    expect(client.delete).toHaveBeenCalledWith('/ads/1')
  })

  it('uploadMedia() envía FormData con content-type multipart', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.post).mockResolvedValue({ data: mockAd })
    const { uploadMedia } = await import('./ads')

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const result = await uploadMedia(1, [file])

    expect(client.post).toHaveBeenCalledWith(
      '/ads/1/media',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    expect(result).toEqual(mockAd)
  })

  it('deleteMedia() hace DELETE /ads/media/:mediaId', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.delete).mockResolvedValue({})
    const { deleteMedia } = await import('./ads')

    await deleteMedia(1)

    expect(client.delete).toHaveBeenCalledWith('/ads/media/1')
  })

  it('fetchMyAds() hace GET /ads/my', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.get).mockResolvedValue({ data: [mockAd] })
    const { fetchMyAds } = await import('./ads')

    const result = await fetchMyAds()

    expect(client.get).toHaveBeenCalledWith('/ads/my')
    expect(result).toEqual([mockAd])
  })

  it('generateCopy() hace POST /ads/generate-copy', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.post).mockResolvedValue({ data: mockCopy })
    const { generateCopy } = await import('./ads')

    const result = await generateCopy({ prompt: 'create', keywords: [] })

    expect(client.post).toHaveBeenCalledWith('/ads/generate-copy', { prompt: 'create', keywords: [] })
    expect(result).toEqual(mockCopy)
  })

  it('propaga errores', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.get).mockRejectedValue(new Error('Not found'))
    const { fetchAd } = await import('./ads')

    await expect(fetchAd(999)).rejects.toThrow('Not found')
  })
})
