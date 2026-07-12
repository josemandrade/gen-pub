// ============================================================
// api/campaigns.ts — Funciones CRUD de campañas
// ============================================================

import client from './client'
import type { Campaign, CreateCampaignRequest } from '../types'

// GET /api/campaigns — Listar todas las campañas
export async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await client.get('/campaigns')
  return res.data
}

// POST /api/campaigns — Crear nueva campaña
export async function createCampaign(data: CreateCampaignRequest): Promise<Campaign> {
  const res = await client.post('/campaigns', data)
  return res.data
}
