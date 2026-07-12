// ============================================================
// components/auth/LoginForm.tsx — Formulario de inicio de sesión
// ============================================================
// React Hook Form + Zod: validación del lado del cliente.
//
// useForm → hook que maneja el estado del formulario.
// zodResolver → conecta el esquema de validación Zod con React Hook Form.
//
// El esquema Zod define reglas: email debe ser email válido,
// password no puede estar vacío.

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '../../hooks/useAuth'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent, CardHeader } from '../ui/Card'

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

// Tipo inferido del esquema (TypeScript lo deduce automáticamente)
type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const loginMutation = useLogin()   // hook de mutación (TanStack Query)

  // register: conecta cada input con React Hook Form
  // handleSubmit: ejecuta validación y llama a onSubmit
  // errors: errores de validación
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)   // ejecuta la mutación (POST /login)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-xl font-semibold text-center">Iniciar Sesión</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}    // mensaje de error si no valida
            {...register('email')}            // conecta con React Hook Form
          />
          <Input
            id="password"
            label="Contraseña"
            type="password"
            placeholder="••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          {/* Error del servidor (credenciales incorrectas) */}
          {loginMutation.isError && (
            <p className="text-sm text-red-500">
              {loginMutation.error instanceof Error ? loginMutation.error.message : 'Error al iniciar sesión'}
            </p>
          )}
          <Button type="submit" isLoading={loginMutation.isPending} className="w-full">
            Iniciar Sesión
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
