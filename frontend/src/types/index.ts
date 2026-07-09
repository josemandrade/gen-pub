export interface User {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR'
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface ApiError {
  status: number
  error: string
  message: string
  timestamp: string
}

export interface Campaign {
  id: number
  name: string
  description: string
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

export interface Ad {
  id: number
  campaignId: number
  title: string
  body: string
  imageUrl: string | null
  status: 'DRAFT' | 'GENERATED' | 'APPROVED' | 'REJECTED'
  createdAt: string
}
