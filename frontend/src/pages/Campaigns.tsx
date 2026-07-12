// ============================================================
// pages/Campaigns.tsx — Gestión de campañas publicitarias
// ============================================================
// Muestra lista de campañas y formulario para crear nuevas.
// Estado local showForm controla si el formulario está visible.

import { useState } from 'react'
import { useCampaigns, useCreateCampaign } from '../hooks/useCampaigns'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Plus, FolderOpen } from 'lucide-react'

export default function Campaigns() {
  const { data: campaigns, isLoading } = useCampaigns()
  const createCampaign = useCreateCampaign()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    createCampaign.mutate(
      { name, description },
      {
        onSuccess: () => {
          setName('')
          setDescription('')
          setShowForm(false)    // oculta el formulario tras crear
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas</h1>
          <p className="text-gray-500">Gestiona tus campañas publicitarias</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Nueva Campaña
        </Button>
      </div>

      {/* Formulario de nueva campaña (toggle) */}
      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Nueva Campaña</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="campaign-name"
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la campaña"
            />
            <div className="space-y-1">
              <label htmlFor="campaign-desc" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                id="campaign-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción (opcional)"
              />
            </div>
            <Button onClick={handleCreate} isLoading={createCampaign.isPending}>
              Crear Campaña
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : campaigns && campaigns.length > 0 ? (
        // Grid de campañas
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {c.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{c.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className={`px-2 py-0.5 rounded-full ${
                    c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    c.status === 'PAUSED' ? 'bg-yellow-100 text-yellow-700' :
                    c.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {c.status === 'DRAFT' ? 'Borrador' :
                     c.status === 'ACTIVE' ? 'Activa' :
                     c.status === 'PAUSED' ? 'Pausada' : 'Completada'}
                  </span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Estado vacío
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-gray-500">No hay campañas aún</p>
          <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>
            Crear primera campaña
          </Button>
        </div>
      )}
    </div>
  )
}
