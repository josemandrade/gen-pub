import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('combina clases simples', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('filtra valores falsy', () => {
    expect(cn('px-4', false && 'hidden', undefined, null, 'py-2')).toBe('px-4 py-2')
  })

  it('filtra valores falsy condicionales', () => {
    expect(cn('base', true && 'visible', false && 'hidden')).toBe('base visible')
  })

  it('resuelve conflictos de Tailwind (última clase gana)', () => {
    expect(cn('px-4', 'px-8')).toBe('px-8')
  })

  it('resuelve conflictos con variantes', () => {
    expect(cn('px-4', 'px-8', 'py-2')).toBe('px-8 py-2')
  })

  it('acepta string vacío', () => {
    expect(cn('')).toBe('')
  })

  it('acepta solo clases condicionales', () => {
    expect(cn(false && 'hidden', true && 'block')).toBe('block')
  })

  it('funciona con objetos clsx', () => {
    expect(cn({ 'text-red-500': true, 'bg-blue-500': false })).toBe('text-red-500')
  })
})
