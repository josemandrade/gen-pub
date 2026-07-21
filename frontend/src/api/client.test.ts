import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TOKEN_KEY } from '../utils/constants'

const TOKEN = 'jwt-token-123'

beforeEach(() => {
  localStorage.clear()
  delete (window as any).location
  window.location = { href: '' } as any
})

describe('client interceptors', () => {
  it('agrega Authorization header cuando hay token', async () => {
    localStorage.setItem(TOKEN_KEY, TOKEN)
    const { default: client } = await import('./client')

    const config = client.interceptors.request.handlers[0].fulfilled({ headers: {} } as any)

    expect(config.headers.Authorization).toBe(`Bearer ${TOKEN}`)
  })

  it('no agrega Authorization header cuando no hay token', async () => {
    const { default: client } = await import('./client')

    const config = client.interceptors.request.handlers[0].fulfilled({ headers: {} } as any)

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('preserva otros headers existentes', async () => {
    localStorage.setItem(TOKEN_KEY, TOKEN)
    const { default: client } = await import('./client')

    const config = client.interceptors.request.handlers[0].fulfilled({
      headers: { 'Content-Type': 'application/json' },
    } as any)

    expect(config.headers['Content-Type']).toBe('application/json')
    expect(config.headers.Authorization).toBe(`Bearer ${TOKEN}`)
  })

  it('pasa respuestas exitosas sin cambios', async () => {
    const { default: client } = await import('./client')
    const response = { data: 'ok', status: 200 }

    const result = client.interceptors.response.handlers[0].fulfilled(response as any)

    expect(result).toBe(response)
  })

  it('captura 401, limpia localStorage y redirige a /login', async () => {
    localStorage.setItem(TOKEN_KEY, TOKEN)
    const { default: client } = await import('./client')

    const error = { response: { status: 401 } }
    await expect(
      client.interceptors.response.handlers[0].rejected(error as any),
    ).rejects.toBe(error)

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(window.location.href).toBe('/login')
  })

  it('no redirige para errores no-401', async () => {
    localStorage.setItem(TOKEN_KEY, TOKEN)
    const { default: client } = await import('./client')

    for (const status of [400, 403, 404, 500]) {
      const error = { response: { status } }
      await expect(
        client.interceptors.response.handlers[0].rejected(error as any),
      ).rejects.toBe(error)
    }

    expect(localStorage.getItem(TOKEN_KEY)).toBe(TOKEN)
    expect(window.location.href).toBe('')
  })

  it('rechaza la promesa en error 401', async () => {
    const { default: client } = await import('./client')
    const error = { response: { status: 401 } }

    await expect(
      client.interceptors.response.handlers[0].rejected(error as any),
    ).rejects.toBeDefined()
  })
})
