import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardContent } from './Card'

describe('Card', () => {
  it('renderiza children', () => {
    render(<Card><p>Contenido</p></Card>)
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('aplica clases base', () => {
    const { container } = render(<Card>Card</Card>)
    expect(container.firstChild).toHaveClass('rounded-xl', 'border', 'bg-white', 'shadow-sm')
  })

  it('mergea className adicional', () => {
    const { container } = render(<Card className="extra">Card</Card>)
    expect(container.firstChild).toHaveClass('extra')
  })
})

describe('CardHeader', () => {
  it('renderiza children', () => {
    render(<CardHeader><h2>Título</h2></CardHeader>)
    expect(screen.getByText('Título')).toBeInTheDocument()
  })

  it('aplica clases base', () => {
    const { container } = render(<CardHeader>Header</CardHeader>)
    expect(container.firstChild).toHaveClass('border-b', 'px-6', 'py-4')
  })
})

describe('CardContent', () => {
  it('renderiza children', () => {
    render(<CardContent><p>Contenido</p></CardContent>)
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('aplica clases base', () => {
    const { container } = render(<CardContent>Content</CardContent>)
    expect(container.firstChild).toHaveClass('px-6', 'py-4')
  })
})
