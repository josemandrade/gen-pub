// ============================================================
// hooks/useCampaigns.ts — Hooks para operaciones con campañas
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCampaigns, createCampaign } from '../api/campaigns'
import type { CreateCampaignRequest } from '../types'

// useCampaigns() — Obtiene todas las campañas
export function useCampaigns() {
  return useQuery({
    queryKey: ['campaigns'],       // clave única en caché
    queryFn: fetchCampaigns,
  })
}

// useCreateCampaign() — Crea una nueva campaña
export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => createCampaign(data),
    onSuccess: () => {
      // Al crear una campaña, refresca la lista
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}
