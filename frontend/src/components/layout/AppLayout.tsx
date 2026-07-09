import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'
import { FileText, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between border-b bg-white px-4 py-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <h1 className="text-lg font-semibold">Generador de Publicidad</h1>
        <div className="w-6" />
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-white transition-transform lg:static lg:translate-x-0`}
        >
          <div className="flex h-full flex-col">
            <div className="hidden lg:flex items-center gap-2 border-b px-6 py-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold">Gen. Publicidad</span>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              <Link
                to="/"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/campaigns"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                Campañas
              </Link>
              <Link
                to="/ads/new"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                Nuevo Anuncio
              </Link>
            </nav>

            <div className="border-t px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
