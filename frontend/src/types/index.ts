// ============================================================
// types/index.ts — Interfaces (contratos) de datos
// ============================================================
// En TypeScript, las "interfaces" definen la forma que debe tener
// un objeto. Sirven como documentación viva y el compilador
// verifica que los datos coincidan con estas formas.

// Usuario del sistema (viene del backend)
export interface User {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR'
}

// Respuesta del backend cuando hace login o registro
export interface AuthResponse {
  token: string       // JWT que identifica al usuario
  user: User
}

// Cuerpo de la petición de login
export interface LoginRequest {
  email: string
  password: string
}

// Cuerpo de la petición de registro
export interface RegisterRequest {
  name: string
  email: string
  password: string
}

// Formato estándar de error que devuelve el backend
export interface ApiError {
  status: number
  error: string
  message: string
  timestamp: string
}

// Una campaña publicitaria (agrupa varios anuncios)
export interface Campaign {
  id: number
  name: string
  description: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

// Archivo multimedia (imagen o video) subido a un anuncio
export interface Media {
  id: number
  adId: number
  originalName: string
  contentType: string    // ej: "image/jpeg", "video/mp4"
  size: number           // en bytes
  mediaType: 'IMAGE' | 'VIDEO'
  url: string            // ruta para mostrar el archivo
  createdAt: string
}

// Anuncio publicitario completo
export interface Ad {
  id: number
  campaignId: number
  campaignName: string
  title: string
  description: string
  status: 'DRAFT' | 'GENERATED' | 'APPROVED' | 'REJECTED'
  media: Media[]
  createdAt: string
  updatedAt: string
}

// Copia generada por la IA
export interface GeneratedCopy {
  title: string
  description: string
  imageSuggestions: string[]   // palabras clave sugeridas
}

// Petición para crear un anuncio
export interface CreateAdRequest {
  campaignId: number
  title: string
  description?: string
}

// Petición para actualizar un anuncio
export interface UpdateAdRequest {
  title?: string
  description?: string
  status?: string
}

// Petición para generar copy con IA
export interface GenerateCopyRequest {
  prompt: string        // descripción de lo que se quiere
  mediaIds: number[]    // IDs de archivos de referencia
}

// Petición para crear una campaña
export interface CreateCampaignRequest {
  name: string
  description?: string
}
