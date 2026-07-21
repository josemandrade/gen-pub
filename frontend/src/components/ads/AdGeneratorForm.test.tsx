import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const mockCopy = {
  title: 'Título genial',
  description: 'Descripción persuasiva',
  imageSuggestions: ['keyword1', 'keyword2'],
}

const mockOnGenerate = vi.fn()
const mockOnApply = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('AdGeneratorForm', () => {
  it('renderiza input de prompt y botón Generar', async () => {
    const { AdGeneratorForm } = await import('./AdGeneratorForm')
    render(React.createElement(AdGeneratorForm, {
      onGenerate: mockOnGenerate,
      onApply: mockOnApply,
    }))

    expect(screen.getByPlaceholderText(/describe el anuncio/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generar/i })).toBeInTheDocument()
  })

  it('no llama a onGenerate si prompt vacío', async () => {
    const user = userEvent.setup()
    const { AdGeneratorForm } = await import('./AdGeneratorForm')
    render(React.createElement(AdGeneratorForm, {
      onGenerate: mockOnGenerate,
      onApply: mockOnApply,
    }))

    await user.click(screen.getByRole('button', { name: /generar/i }))
    expect(mockOnGenerate).not.toHaveBeenCalled()
  })

  it('llama a onGenerate con el prompt al hacer click', async () => {
    mockOnGenerate.mockResolvedValue(mockCopy)
    const user = userEvent.setup()
    const { AdGeneratorForm } = await import('./AdGeneratorForm')
    render(React.createElement(AdGeneratorForm, {
      onGenerate: mockOnGenerate,
      onApply: mockOnApply,
    }))

    await user.type(screen.getByPlaceholderText(/describe el anuncio/i), 'create an ad')
    await user.click(screen.getByRole('button', { name: /generar/i }))

    await waitFor(() => {
      expect(mockOnGenerate).toHaveBeenCalledWith('create an ad')
    })
  })

  it('muestra resultado después de generar', async () => {
    mockOnGenerate.mockResolvedValue(mockCopy)
    const user = userEvent.setup()
    const { AdGeneratorForm } = await import('./AdGeneratorForm')
    render(React.createElement(AdGeneratorForm, {
      onGenerate: mockOnGenerate,
      onApply: mockOnApply,
    }))

    await user.type(screen.getByPlaceholderText(/describe el anuncio/i), 'create an ad')
    await user.click(screen.getByRole('button', { name: /generar/i }))

    await waitFor(() => {
      expect(screen.getByText('Título genial')).toBeInTheDocument()
      expect(screen.getByText('Descripción persuasiva')).toBeInTheDocument()
    })
  })

  it('muestra sugerencias de imágenes', async () => {
    mockOnGenerate.mockResolvedValue(mockCopy)
    const user = userEvent.setup()
    const { AdGeneratorForm } = await import('./AdGeneratorForm')
    render(React.createElement(AdGeneratorForm, {
      onGenerate: mockOnGenerate,
      onApply: mockOnApply,
    }))

    await user.type(screen.getByPlaceholderText(/describe el anuncio/i), 'create an ad')
    await user.click(screen.getByRole('button', { name: /generar/i }))

    await waitFor(() => {
      expect(screen.getByText('keyword1')).toBeInTheDocument()
      expect(screen.getByText('keyword2')).toBeInTheDocument()
    })
  })

  it('botón Regenerar limpia el resultado', async () => {
    mockOnGenerate.mockResolvedValue(mockCopy)
    const user = userEvent.setup()
    const { AdGeneratorForm } = await import('./AdGeneratorForm')
    render(React.createElement(AdGeneratorForm, {
      onGenerate: mockOnGenerate,
      onApply: mockOnApply,
    }))

    await user.type(screen.getByPlaceholderText(/describe el anuncio/i), 'create an ad')
    await user.click(screen.getByRole('button', { name: /generar/i }))
    await waitFor(() => expect(screen.getByText('Título genial')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /regenerar/i }))
    expect(screen.queryByText('Título genial')).not.toBeInTheDocument()
  })

  it('botón Aplicar llama a onApply con el resultado', async () => {
    mockOnGenerate.mockResolvedValue(mockCopy)
    const user = userEvent.setup()
    const { AdGeneratorForm } = await import('./AdGeneratorForm')
    render(React.createElement(AdGeneratorForm, {
      onGenerate: mockOnGenerate,
      onApply: mockOnApply,
    }))

    await user.type(screen.getByPlaceholderText(/describe el anuncio/i), 'create an ad')
    await user.click(screen.getByRole('button', { name: /generar/i }))
    await waitFor(() => expect(screen.getByText('Aplicar al anuncio')).toBeInTheDocument())

    await user.click(screen.getByText('Aplicar al anuncio'))
    expect(mockOnApply).toHaveBeenCalledWith(mockCopy)
  })

  it('no renderiza sugerencias si imageSuggestions vacío', async () => {
    mockOnGenerate.mockResolvedValue({ ...mockCopy, imageSuggestions: [] })
    const user = userEvent.setup()
    const { AdGeneratorForm } = await import('./AdGeneratorForm')
    render(React.createElement(AdGeneratorForm, {
      onGenerate: mockOnGenerate,
      onApply: mockOnApply,
    }))

    await user.type(screen.getByPlaceholderText(/describe el anuncio/i), 'create')
    await user.click(screen.getByRole('button', { name: /generar/i }))

    await waitFor(() => {
      expect(screen.queryByText('Sugerencias de imágenes')).not.toBeInTheDocument()
    })
  })

  it('maneja error en generación sin romper', async () => {
    mockOnGenerate.mockRejectedValue(new Error('API error'))
    const user = userEvent.setup()
    const { AdGeneratorForm } = await import('./AdGeneratorForm')
    render(React.createElement(AdGeneratorForm, {
      onGenerate: mockOnGenerate,
      onApply: mockOnApply,
    }))

    await user.type(screen.getByPlaceholderText(/describe el anuncio/i), 'create')
    await user.click(screen.getByRole('button', { name: /generar/i }))

    await waitFor(() => {
      expect(screen.queryByText('Título genial')).not.toBeInTheDocument()
    })
  })
})
