import { Link } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 mb-4">
            <span className="font-display text-xl font-bold text-white">G</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-stone-900">Generador de Publicidad</h1>
          <p className="mt-1 text-sm text-stone-400">Inicia sesión para continuar</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-stone-400">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-teal-600 hover:text-teal-700 transition-colors">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
