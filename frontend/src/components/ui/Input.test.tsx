import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('renderiza el input con id', () => {
    render(<Input id="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email')
  })

  it('renderiza el label cuando se provee', () => {
    render(<Input id="email" label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('no renderiza label si no se provee', () => {
    const { container } = render(<Input id="email" />)
    expect(container.querySelector('label')).not.toBeInTheDocument()
  })

  it('muestra mensaje de error', () => {
    render(<Input id="email" error="Email inválido" />)
    expect(screen.getByText('Email inválido')).toBeInTheDocument()
  })

  it('aplica estilos de error cuando hay error', () => {
    render(<Input id="email" error="Error" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-red-300')
  })

  it('aplica estilos normales cuando no hay error', () => {
    render(<Input id="email" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-stone-300')
  })

  it('no muestra mensaje de error si no se provee', () => {
    render(<Input id="email" />)
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })

  it('asocia el label con el input mediante htmlFor', () => {
    render(<Input id="email" label="Email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email')
  })

  it('captura el valor del input', async () => {
    render(<Input id="name" />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Hello')
    expect(input).toHaveValue('Hello')
  })

  it('mergea className adicional', () => {
    render(<Input id="test" className="extra-class" />)
    expect(screen.getByRole('textbox')).toHaveClass('extra-class')
  })
})
