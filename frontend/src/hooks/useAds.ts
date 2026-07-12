// ============================================================
// hooks/useAds.ts — Hooks para operaciones con anuncios
// ============================================================
// useQuery → para LEER datos del servidor (GET)
// useMutation → para ESCRIBIR/MODIFICAR (POST, PUT, DELETE)
//
// queryKey identifica cada consulta en la caché.
// invalidateQueries fuerza a recargar datos cuando cambian.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAds, fetchAd, createAd, updateAd, deleteAd,
  uploadMedia, deleteMedia, generateCopy, fetchMyAds,
} from '../api/ads'
import type { CreateAdRequest, UpdateAdRequest, GenerateCopyRequest } from '../types'

// useAds(campaignId) — Obtiene anuncios de una campaña específica
// enabled: !!campaignId → solo ejecuta si hay un campaignId válido
export function useAds(campaignId: number | null) {
  return useQuery({
    queryKey: ['ads', campaignId],
    queryFn: () => fetchAds(campaignId!),
    enabled: !!campaignId,
  })
}

// useAd(id) — Obtiene un anuncio por su ID
export function useAd(id: number | null) {
  return useQuery({
    queryKey: ['ad', id],
    queryFn: () => fetchAd(id!),
    enabled: !!id,
  })
}

// useCreateAd() — Crea un nuevo anuncio
// onSuccess: invalida la caché de 'ads' para que se refresque
export function useCreateAd() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAdRequest) => createAd(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}

// useUpdateAd() — Actualiza un anuncio existente
export function useUpdateAd() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAdRequest }) => updateAd(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}

// useDeleteAd() — Elimina un anuncio
export function useDeleteAd() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}

// useUploadMedia() — Sube archivos a un anuncio
export function useUploadMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ adId, files }: { adId: number; files: File[] }) => uploadMedia(adId, files),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ad', data.id] })
      queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}

// useDeleteMedia() — Elimina un archivo multimedia
export function useDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (mediaId: number) => deleteMedia(mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })
}

// useMyAds() — Obtiene los anuncios del usuario actual
export function useMyAds() {
  return useQuery({
    queryKey: ['ads', 'my'],
    queryFn: fetchMyAds,
  })
}

// useGenerateCopy() — Genera copy con IA
// Nota: no invalida caché porque no modifica el anuncio
export function useGenerateCopy() {
  return useMutation({
    mutationFn: (data: GenerateCopyRequest) => generateCopy(data),
  })
}
