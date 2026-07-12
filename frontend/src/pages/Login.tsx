// ============================================================
// pages/Login.tsx — Página de inicio de sesión
// ============================================================
// Las "pages" son componentes que representan pantallas completas.
// Aquí solo maqueta la página y usa LoginForm como componente hijo.

import { Link } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Generador de Publicidad</h1>
          <p className="mt-1 text-sm text-gray-500">Inicia sesión para continuar</p>
        </div>
        <LoginForm />
        {/* Link a registro (React Router <Link> evita recargar la página) */}
        <p className="text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
