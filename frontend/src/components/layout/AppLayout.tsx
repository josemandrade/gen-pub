import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LayoutDashboard, Megaphone, FileText, Plus, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/campaigns', label: 'Campañas', icon: Megaphone },
  { to: '/ads', label: 'Mis Anuncios', icon: FileText },
  { to: '/ads/new', label: 'Nuevo Anuncio', icon: Plus },
]

export function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="lg:hidden flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 -ml-1 rounded-lg hover:bg-stone-100 transition-colors">
          {sidebarOpen ? <X className="h-5 w-5 text-stone-600" /> : <Menu className="h-5 w-5 text-stone-600" />}
        </button>
        <span className="font-display text-base font-bold text-stone-900">Generador</span>
        <div className="w-5" />
      </header>

      <div className="flex">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-stone-200 bg-white transition-transform lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-full flex-col">
            <div className="hidden lg:flex items-center gap-3 border-b border-stone-100 px-6 py-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600">
                <span className="font-display text-sm font-bold text-white">G</span>
              </div>
              <div>
                <span className="block font-display text-base font-bold leading-tight text-stone-900">Generador</span>
                <span className="block text-[11px] font-medium tracking-wide text-stone-400 uppercase">de Publicidad</span>
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              <p className="px-3 pb-2 text-[11px] font-semibold tracking-widest text-stone-400 uppercase">Menú</p>
              {navItems.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
                    )}
                  >
                    <item.icon className={cn('h-4 w-4', isActive ? 'text-teal-600' : 'text-stone-400')} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-stone-100 px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stone-800">{user?.name}</p>
                  <p className="truncate text-xs text-stone-400">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/15 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 lg:p-8 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
