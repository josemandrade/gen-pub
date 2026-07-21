import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

const baseAd = {
  id: 1,
  campaignId: 1,
  campaignName: 'Test Campaign',
  title: 'Test Ad',
  description: 'Description text',
  status: 'DRAFT' as const,
  media: [],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('AdPreview', () => {
  it('renderiza título y descripción', async () => {
    const { AdPreview } = await import('./AdPreview')
    render(React.createElement(AdPreview, { ad: baseAd }))

    expect(screen.getByText('Test Ad')).toBeInTheDocument()
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('renderiza status DRAFT como Borrador', async () => {
    const { AdPreview } = await import('./AdPreview')
    render(React.createElement(AdPreview, { ad: baseAd }))

    expect(screen.getByText('Borrador')).toBeInTheDocument()
  })

  it('renderiza status GENERATED como Generado', async () => {
    const { AdPreview } = await import('./AdPreview')
    render(React.createElement(AdPreview, { ad: { ...baseAd, status: 'GENERATED' } }))

    expect(screen.getByText('Generado')).toBeInTheDocument()
  })

  it('renderiza status APPROVED como Aprobado', async () => {
    const { AdPreview } = await import('./AdPreview')
    render(React.createElement(AdPreview, { ad: { ...baseAd, status: 'APPROVED' } }))

    expect(screen.getByText('Aprobado')).toBeInTheDocument()
  })

  it('renderiza status REJECTED como Rechazado', async () => {
    const { AdPreview } = await import('./AdPreview')
    render(React.createElement(AdPreview, { ad: { ...baseAd, status: 'REJECTED' } }))

    expect(screen.getByText('Rechazado')).toBeInTheDocument()
  })

  it('renderiza media cuando hay archivos', async () => {
    const { AdPreview } = await import('./AdPreview')
    render(React.createElement(AdPreview, {
      ad: {
        ...baseAd,
        media: [{
          id: 1, adId: 1, originalName: 'img.jpg', contentType: 'image/jpeg',
          size: 1024, mediaType: 'IMAGE' as const, url: '/uploads/img.jpg', createdAt: '2024-01-01T00:00:00Z',
        }],
      },
    }))

    const img = screen.getByAltText('img.jpg')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/uploads/img.jpg')
  })

  it('no renderiza descripción si está vacía', async () => {
    const { AdPreview } = await import('./AdPreview')
    render(React.createElement(AdPreview, { ad: { ...baseAd, description: '' } }))

    expect(screen.queryByText('Description text')).not.toBeInTheDocument()
  })
})
