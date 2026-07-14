import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('combina clases simples', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('filtra valores falsy', () => {
    expect(cn('px-4', '' as string, undefined, null, 'py-2')).toBe('px-4 py-2')
  })

  it('incluye clases condicionales cuando son true', () => {
    expect(cn('base', 'visible', '')).toBe('base visible')
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

  it('filtra clases condicionales falsy pasando null', () => {
    const show = false
    expect(cn('block', show && 'hidden')).toBe('block')
  })

  it('incluye clases condicionales truthy', () => {
    const show = true
    expect(cn('base', show && 'visible')).toBe('base visible')
  })

  it('funciona con objetos clsx', () => {
    const isActive = true
    const isDisabled = false
    expect(cn({ 'text-red-500': isActive, 'bg-blue-500': isDisabled })).toBe('text-red-500')
  })
})
