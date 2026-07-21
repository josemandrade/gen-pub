import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const mockOnUpload = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('FileUploader', () => {
  it('renderiza zona de drop con instrucciones', async () => {
    const { FileUploader } = await import('./FileUploader')
    render(React.createElement(FileUploader, { onUpload: mockOnUpload }))

    expect(screen.getByText(/arrastra imágenes/i)).toBeInTheDocument()
    expect(screen.getByText(/png, jpg/i)).toBeInTheDocument()
  })

  it('muestra botón Subir cuando hay archivos', async () => {
    const { FileUploader } = await import('./FileUploader')
    render(React.createElement(FileUploader, { onUpload: mockOnUpload }))

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    await userEvent.upload(fileInput, file)

    expect(screen.getByText(/subir 1 archivo/i)).toBeInTheDocument()
  })

  it('llama a onUpload con archivos', async () => {
    const { FileUploader } = await import('./FileUploader')
    render(React.createElement(FileUploader, { onUpload: mockOnUpload }))

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    await userEvent.upload(fileInput, file)

    await userEvent.click(screen.getByText(/subir 1 archivo/i))

    expect(mockOnUpload).toHaveBeenCalled()
    const callsArgs = mockOnUpload.mock.calls[0]![0] as File[]
    expect(callsArgs.length).toBe(1)
    expect(callsArgs[0]!.name).toBe('test.png')
  })

  it('no llama a onUpload si no hay archivos', async () => {
    const { FileUploader } = await import('./FileUploader')
    render(React.createElement(FileUploader, { onUpload: mockOnUpload }))

    expect(screen.queryByText(/subir/i)).not.toBeInTheDocument()
    expect(mockOnUpload).not.toHaveBeenCalled()
  })

  it('elimina archivo con botón X', async () => {
    const { FileUploader } = await import('./FileUploader')
    render(React.createElement(FileUploader, { onUpload: mockOnUpload }))

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['test'], 'test.png', { type: 'image/png' })
    await userEvent.upload(fileInput, file)

    expect(screen.getByText(/subir 1 archivo/i)).toBeInTheDocument()

    const removeBtn = document.querySelector('button[type="button"]') as HTMLElement | null
    if (removeBtn) {
      await userEvent.click(removeBtn)
    }

    expect(screen.queryByText(/subir/i)).not.toBeInTheDocument()
  })
})
