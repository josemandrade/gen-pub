import { describe, it, expect, beforeEach } from 'vitest'
import type { InternalAxiosRequestConfig } from 'axios'
import { TOKEN_KEY } from '../utils/constants'

const TOKEN = 'jwt-token-123'

interface ClientLike {
  interceptors: {
    request: { handlers: unknown[] | undefined }
    response: { handlers: unknown[] | undefined }
  }
}

function getReqHandler(client: ClientLike) {
  return (client.interceptors.request.handlers![0] as { fulfilled: (c: InternalAxiosRequestConfig) => InternalAxiosRequestConfig }).fulfilled
}

function getResHandler(client: ClientLike) {
  return {
    fulfilled: (client.interceptors.response.handlers![0] as { fulfilled: (r: unknown) => unknown }).fulfilled,
    rejected: (client.interceptors.response.handlers![0] as { rejected: (e: Error) => never }).rejected,
  }
}

beforeEach(() => {
  localStorage.clear()
  delete (window as unknown as Record<string, unknown>).location
  window.location = { href: '' } as Location
})

describe('client interceptors', () => {
  it('agrega Authorization header cuando hay token', async () => {
    localStorage.setItem(TOKEN_KEY, TOKEN)
    const { default: client } = await import('./client')

    const config = getReqHandler(client as unknown as ClientLike)({ headers: {} } as unknown as InternalAxiosRequestConfig)

    expect(config.headers.Authorization).toBe(`Bearer ${TOKEN}`)
  })

  it('no agrega Authorization header cuando no hay token', async () => {
    const { default: client } = await import('./client')

    const config = getReqHandler(client as unknown as ClientLike)({ headers: {} } as unknown as InternalAxiosRequestConfig)

    expect(config.headers.Authorization).toBeUndefined()
  })

  it('preserva otros headers existentes', async () => {
    localStorage.setItem(TOKEN_KEY, TOKEN)
    const { default: client } = await import('./client')

    const config = getReqHandler(client as unknown as ClientLike)({
      headers: { 'Content-Type': 'application/json' },
    } as unknown as InternalAxiosRequestConfig)

    expect(config.headers['Content-Type']).toBe('application/json')
    expect(config.headers.Authorization).toBe(`Bearer ${TOKEN}`)
  })

  it('pasa respuestas exitosas sin cambios', async () => {
    const { default: client } = await import('./client')
    const response = { data: 'ok', status: 200 }

    const result = getResHandler(client as unknown as ClientLike).fulfilled(response)

    expect(result).toBe(response)
  })

  it('captura 401, limpia localStorage y redirige a /login', async () => {
    localStorage.setItem(TOKEN_KEY, TOKEN)
    const { default: client } = await import('./client')

    const error = { response: { status: 401 } }
    await expect(
      Promise.resolve(getResHandler(client as unknown as ClientLike).rejected(error as unknown as Error)),
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
        Promise.resolve(getResHandler(client as unknown as ClientLike).rejected(error as unknown as Error)),
      ).rejects.toBe(error)
    }

    expect(localStorage.getItem(TOKEN_KEY)).toBe(TOKEN)
    expect(window.location.href).toBe('')
  })

  it('rechaza la promesa en error 401', async () => {
    const { default: client } = await import('./client')
    const error = { response: { status: 401 } }

    await expect(
      Promise.resolve(getResHandler(client as unknown as ClientLike).rejected(error as unknown as Error)),
    ).rejects.toBeDefined()
  })
})
