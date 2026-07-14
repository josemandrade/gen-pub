import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renderiza el texto del children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('aplica variantes', () => {
    const { container } = render(<Button variant="primary">Primary</Button>)
    expect(container.firstChild).toHaveClass('bg-teal-600')
  })

  it('aplica variante outline', () => {
    const { container } = render(<Button variant="outline">Outline</Button>)
    expect(container.firstChild).toHaveClass('border-stone-300')
  })

  it('aplica tamaño sm', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    expect(container.firstChild).toHaveClass('px-3', 'py-1.5', 'text-sm')
  })

  it('aplica tamaño lg', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    expect(container.firstChild).toHaveClass('px-6', 'py-3', 'text-base')
  })

  it('muestra spinner cuando isLoading', () => {
    render(<Button isLoading>Loading</Button>)
    expect(document.querySelector('svg.animate-spin')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('deshabilita el botón con disabled', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('deshabilita el botón cuando isLoading', () => {
    render(<Button isLoading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('ejecuta onClick al hacer click', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('no ejecuta onClick si está deshabilitado', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('mergea className adicional', () => {
    const { container } = render(<Button className="extra-class">Extra</Button>)
    expect(container.firstChild).toHaveClass('extra-class')
  })
})
