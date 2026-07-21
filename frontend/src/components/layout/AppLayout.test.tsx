import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const mock = vi.hoisted(() => ({
  navigate: vi.fn(),
  logout: vi.fn(),
  authStore: {
    user: { id: 1, name: 'Test User', email: 'test@test.com', role: 'EDITOR' as const },
    logout: vi.fn(),
  },
}))

vi.mock('react-router-dom', () => ({
  Outlet: () => null,
  Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => React.createElement('a', { href: to, className }, children),
  useNavigate: () => mock.navigate,
  useLocation: () => ({ pathname: '/' }),
}))

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => mock.authStore,
}))

beforeEach(() => {
  vi.clearAllMocks()
  mock.authStore.user = { id: 1, name: 'Test User', email: 'test@test.com', role: 'EDITOR' as const }
  mock.authStore.logout = vi.fn()
})

describe('AppLayout', () => {
  it('renderiza links de navegación', async () => {
    const { AppLayout } = await import('./AppLayout')
    render(React.createElement(AppLayout))

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Campañas')).toBeInTheDocument()
    expect(screen.getByText('Mis Anuncios')).toBeInTheDocument()
    expect(screen.getByText('Nuevo Anuncio')).toBeInTheDocument()
  })

  it('renderiza nombre y email del usuario', async () => {
    const { AppLayout } = await import('./AppLayout')
    render(React.createElement(AppLayout))

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@test.com')).toBeInTheDocument()
  })

  it('logout llama a logout() y navigate', async () => {
    const user = userEvent.setup()
    const { AppLayout } = await import('./AppLayout')
    render(React.createElement(AppLayout))

    const logoutBtn = screen.getByTitle('Cerrar sesión')
    await user.click(logoutBtn)

    expect(mock.authStore.logout).toHaveBeenCalled()
    expect(mock.navigate).toHaveBeenCalledWith('/login')
  })

  it('link activo tiene clase teal', async () => {
    const { AppLayout } = await import('./AppLayout')
    render(React.createElement(AppLayout))

    const dashboardLink = screen.getByText('Dashboard').closest('a')
    expect(dashboardLink?.className).toContain('teal')
  })
})
