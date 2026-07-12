// ============================================================
// api/ads.ts — Funciones CRUD de anuncios (llamadas HTTP)
// ============================================================

import client from './client'
import type { Ad, GeneratedCopy, CreateAdRequest, UpdateAdRequest, GenerateCopyRequest } from '../types'

// GET /api/ads?campaignId=X — Lista anuncios de una campaña
export async function fetchAds(campaignId: number): Promise<Ad[]> {
  const res = await client.get('/ads', { params: { campaignId } })
  return res.data
}

// GET /api/ads/:id — Obtener un anuncio por ID
export async function fetchAd(id: number): Promise<Ad> {
  const res = await client.get(`/ads/${id}`)
  return res.data
}

// POST /api/ads — Crear nuevo anuncio
export async function createAd(data: CreateAdRequest): Promise<Ad> {
  const res = await client.post('/ads', data)
  return res.data
}

// PUT /api/ads/:id — Actualizar anuncio existente
export async function updateAd(id: number, data: UpdateAdRequest): Promise<Ad> {
  const res = await client.put(`/ads/${id}`, data)
  return res.data
}

// DELETE /api/ads/:id — Eliminar anuncio
export async function deleteAd(id: number): Promise<void> {
  await client.delete(`/ads/${id}`)
}

// POST /api/ads/:id/media — Subir archivos multimedia
// Usa FormData porque envía archivos binarios (multipart/form-data)
export async function uploadMedia(adId: number, files: File[]): Promise<Ad> {
  const formData = new FormData()
  files.forEach((f) => formData.append('files', f))
  const res = await client.post(`/ads/${adId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

// DELETE /api/ads/media/:mediaId — Eliminar un archivo multimedia
export async function deleteMedia(mediaId: number): Promise<void> {
  await client.delete(`/ads/media/${mediaId}`)
}

// GET /api/ads/my — Lista los anuncios del usuario autenticado
export async function fetchMyAds(): Promise<Ad[]> {
  const res = await client.get('/ads/my')
  return res.data
}

// POST /api/ads/generate-copy — Generar texto del anuncio con IA
export async function generateCopy(data: GenerateCopyRequest): Promise<GeneratedCopy> {
  const res = await client.post('/ads/generate-copy', data)
  return res.data
}
