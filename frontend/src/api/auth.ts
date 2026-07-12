// ============================================================
// api/auth.ts — Funciones para llamar al backend de autenticación
// ============================================================
// Cada función exportada se encarga de un endpoint específico.
// Separa la lógica HTTP de los componentes de React.

import client from './client'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'

// POST /api/auth/login — Iniciar sesión
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await client.post('/auth/login', data)
  return res.data
}

// POST /api/auth/register — Registrar nuevo usuario
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const res = await client.post('/auth/register', data)
  return res.data
}
