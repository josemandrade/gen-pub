// ============================================================
// App.tsx — Componente raíz con el enrutador
// ============================================================
// React Router DOM maneja la navegación del lado del cliente
// (sin recargar la página al cambiar de ruta).
//
// <BrowserRouter> → provee el sistema de rutas
// <Routes> → contiene todas las rutas definidas
// <Route> → define una URL y qué componente renderiza
//
// Estructura:
//   - Rutas públicas: /login, /register (solo si NO autenticado)
//   - Rutas protegidas: el resto (requieren sesión activa)
//
// ProtectedRoute / PublicRoute son "layout routes" que
// verifican autenticación y redirigen si es necesario.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { AppLayout } from './components/layout/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Ads from './pages/Ads'
import AdDetail from './pages/AdDetail'
import AdEdit from './pages/AdEdit'
import AdCreate from './pages/AdCreate'
import Campaigns from './pages/Campaigns'

// Componente que envuelve rutas que requieren autenticación
// Si no está logueado → redirige a /login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

// Componente para rutas que SOLO se ven sin sesión
// (login y register). Si ya está logueado → redirige al inicio
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas (solo sin sesión) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas con layout compartido (AppLayout) */}
        {/* AppLayout tiene un <Outlet /> donde se renderizan
            las rutas hijas (Dashboard, Ads, etc.) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/ads" element={<Ads />} />
          <Route path="/ads/new" element={<AdCreate />} />
          <Route path="/ads/:id" element={<AdDetail />} />
          <Route path="/ads/:id/edit" element={<AdEdit />} />
          <Route path="/campaigns" element={<Campaigns />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
