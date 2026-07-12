// ============================================================
// hooks/useAuth.ts — Hooks de autenticación (TanStack Query)
// ============================================================
// "Hook" es una función especial de React que permite usar
// estado y otras características en componentes funcionales.
//
// useMutation es un hook de TanStack Query para operaciones
// que MODIFICAN datos en el servidor (POST, PUT, DELETE).
// Provee estados: isPending, isError, isSuccess, etc.

import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest, RegisterRequest } from '../types'

// Hook: Iniciar sesión
// useMutation ejecuta login() y si éxito → guarda sesión y redirige
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)   // toma solo setAuth del store
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),  // función que llama al API
    onSuccess: (res) => {
      setAuth(res.user, res.token)  // guarda en store + localStorage
      navigate('/')                 // redirige al dashboard
    },
  })
}

// Hook: Registrar nuevo usuario
export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (res) => {
      setAuth(res.user, res.token)
      navigate('/')
    },
  })
}
