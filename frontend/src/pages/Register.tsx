// ============================================================
// pages/Register.tsx — Página de registro de usuario
// ============================================================

import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/auth/RegisterForm'

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Generador de Publicidad</h1>
          <p className="mt-1 text-sm text-gray-500">Crea tu cuenta gratuita</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
