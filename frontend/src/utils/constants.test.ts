import { describe, it, expect } from 'vitest'
import { API_BASE_URL, TOKEN_KEY } from './constants'

describe('constants', () => {
  it('API_BASE_URL debe ser /api', () => {
    expect(API_BASE_URL).toBe('/api')
  })

  it('TOKEN_KEY debe ser auth_token', () => {
    expect(TOKEN_KEY).toBe('auth_token')
  })
})
