import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthResponse } from '../types'

vi.mock('./client', () => ({
  default: {
    post: vi.fn(),
  },
}))

const mockResponse: AuthResponse = {
  token: 'jwt-token',
  user: { id: 1, name: 'Test', email: 'test@test.com', role: 'EDITOR' },
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('auth API', () => {
  it('login() hace POST /auth/login con data correcta', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.post).mockResolvedValue({ data: mockResponse })
    const { login } = await import('./auth')

    const result = await login({ email: 'test@test.com', password: '123456' })

    expect(client.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@test.com',
      password: '123456',
    })
    expect(result).toEqual(mockResponse)
  })

  it('register() hace POST /auth/register con data correcta', async () => {
    const client = (await import('./client')).default
    vi.mocked(client.post).mockResolvedValue({ data: mockResponse })
    const { register } = await import('./auth')

    const result = await register({
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    })

    expect(client.post).toHaveBeenCalledWith('/auth/register', {
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
    })
    expect(result).toEqual(mockResponse)
  })

  it('login() propaga errores', async () => {
    const client = (await import('./client')).default
    const error = new Error('Network error')
    vi.mocked(client.post).mockRejectedValue(error)
    const { login } = await import('./auth')

    await expect(
      login({ email: 'test@test.com', password: '123456' }),
    ).rejects.toThrow('Network error')
  })

  it('register() propaga errores', async () => {
    const client = (await import('./client')).default
    const error = new Error('Email already exists')
    vi.mocked(client.post).mockRejectedValue(error)
    const { register } = await import('./auth')

    await expect(
      register({ name: 'T', email: 't@t.com', password: '123456' }),
    ).rejects.toThrow('Email already exists')
  })
})
