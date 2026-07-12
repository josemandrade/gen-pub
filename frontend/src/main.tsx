// ============================================================
// main.tsx — Punto de entrada de la aplicación
// ============================================================
// Aquí arranca React. createRoot monta la app en el DIV
// con id="root" del index.html.
//
// TanStack Query: <QueryClientProvider> provee la caché de
// datos del servidor a toda la app.
//
// Flujo de inicio:
//   1. Carga el token guardado (loadFromStorage)
//   2. Verifica si sigue siendo válido (verifyToken)
//   3. Mientras verifica: muestra un spinner de carga
//   4. Cuando termina (ready=true): renderiza la app

import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { useAuthStore } from './store/authStore'
import './index.css'

// QueryClient: instancia única que maneja caché de TanStack Query
const queryClient = new QueryClient()

// Componente Root: verifica autenticación antes de renderizar
function Root() {
  const [ready, setReady] = useState(false)
  const { loadFromStorage, verifyToken } = useAuthStore()

  useEffect(() => {
    // Se ejecuta una sola vez al montar el componente
    loadFromStorage()      // recupera token de localStorage
    verifyToken()          // verifica token contra el backend
      .finally(() => setReady(true))   // pase lo que pase, ya está listo
  }, [])  // [] = sin dependencias → solo al montar

  // Spinner de carga mientras verifica
  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  )
}

// Monta la aplicación en el DOM
createRoot(document.getElementById('root')!).render(<Root />)
