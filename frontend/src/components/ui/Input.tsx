// ============================================================
// components/ui/Input.tsx — Campo de texto reutilizable
// ============================================================
// forwardRef permite que el padre acceda al elemento <input>
// interno (útil para React Hook Form).

import { cn } from '../../utils/cn'
import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string    // etiqueta visible sobre el campo
  error?: string    // mensaje de error (se muestra en rojo)
}

// forwardRef recibe props y un ref (referencia al DOM)
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {/* Label: solo se renderiza si existe */}
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            // Clases base del input
            'block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500',
            // Si hay error → borde rojo, si no → borde gris
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500',
            className,
          )}
          {...props}
        />
        {/* Mensaje de error */}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  },
)

// displayName es necesario para debugging con forwardRef
Input.displayName = 'Input'
