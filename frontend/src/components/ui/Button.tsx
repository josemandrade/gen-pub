// ============================================================
// components/ui/Button.tsx — Botón reutilizable
// ============================================================
// "Componente" es una función que retorna JSX (HTML + lógica).
// Las props son los atributos que recibe (como los atributos HTML).
//
// Este componente extiende los atributos nativos de <button>
// y agrega variantes de estilo: primary, secondary, outline, ghost.
//
// cn() combina clases condicionalmente (ver utils/cn.ts).

import { cn } from '../../utils/cn'
import type { ButtonHTMLAttributes } from 'react'

// Definición de props adicionales del botón
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean    // muestra spinner + deshabilita
}

export function Button({
  className,
  variant = 'primary',    // valor por defecto
  size = 'md',
  isLoading,
  disabled,
  children,
  ...props                // resto de atributos HTML
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Clases base que siempre se aplican
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        // Variantes de color
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400': variant === 'secondary',
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500': variant === 'outline',
          'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-400': variant === 'ghost',
        },
        // Tamaños
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className,    // clases adicionales desde afuera
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Spinner SVG animado (tailwind animate-spin) */}
      {isLoading && (
        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
