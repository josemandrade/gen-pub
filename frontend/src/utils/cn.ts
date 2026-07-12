// ============================================================
// utils/cn.ts — Utilidad para combinar clases de Tailwind
// ============================================================
// "cn" viene de "classNames". Permite escribir clases
// condicionalmente sin preocuparse por conflictos.
//
// Ejemplo:
//   cn('px-4 py-2', isActive && 'bg-blue-500', className)
// Si isActive es true → "px-4 py-2 bg-blue-500"

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
