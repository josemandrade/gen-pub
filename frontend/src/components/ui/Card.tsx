// ============================================================
// components/ui/Card.tsx — Componente de tarjeta
// ============================================================
// Un patrón común es dividir en subcomponentes:
//   <Card>
//     <CardHeader>título</CardHeader>
//     <CardContent>contenido</CardContent>
//   </Card>

import { cn } from '../../utils/cn'
import type { HTMLAttributes } from 'react'

// Card: contenedor principal con bordes y sombra
export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white shadow-sm', className)} {...props}>
      {children}
    </div>
  )
}

// CardHeader: generalmente para el título, con línea separadora
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-b border-gray-100 px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

// CardContent: cuerpo de la tarjeta
export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}
