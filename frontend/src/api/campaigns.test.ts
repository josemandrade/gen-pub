import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

const mockCampaigns = [
  { id: 1, name: 'Camp 1', description: 'Desc 1', status: 'DRAFT', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
]

beforeEach(() => {
  vi.clearAllMocks()
})

describe('campaigns API', () => {
  it('fetchCampaigns() hace GET /campaigns', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.get).mockResolvedValue({ data: mockCampaigns })
    const { fetchCampaigns } = await import('./campaigns')

    const result = await fetchCampaigns()

    expect(client.get).toHaveBeenCalledWith('/campaigns')
    expect(result).toEqual(mockCampaigns)
  })

  it('createCampaign() hace POST /campaigns con data', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.post).mockResolvedValue({ data: mockCampaigns[0] })
    const { createCampaign } = await import('./campaigns')

    const result = await createCampaign({ name: 'Camp 1', description: 'Desc' })

    expect(client.post).toHaveBeenCalledWith('/campaigns', { name: 'Camp 1', description: 'Desc' })
    expect(result).toEqual(mockCampaigns[0])
  })

  it('propaga errores del servidor', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.get).mockRejectedValue(new Error('API error'))
    const { fetchCampaigns } = await import('./campaigns')

    await expect(fetchCampaigns()).rejects.toThrow('API error')
  })
})
