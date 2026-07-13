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
          setShowForm(false)
        },
      },
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-400 tracking-wider uppercase">Gestión</p>
          <h1 className="font-display text-3xl font-bold text-stone-900 mt-1">Campañas</h1>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1.5" /> Nueva Campaña
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="font-display font-semibold text-stone-900">Nueva Campaña</h2>
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
              <label htmlFor="campaign-desc" className="block text-sm font-medium text-stone-700">
                Descripción
              </label>
              <textarea
                id="campaign-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:border-teal-500 focus:ring-teal-500/30"
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
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        </div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <h3 className="font-display font-semibold text-stone-900">{c.name}</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {c.description && (
                  <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">{c.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    c.status === 'ACTIVE' ? 'bg-teal-50 text-teal-700' :
                    c.status === 'PAUSED' ? 'bg-amber-50 text-amber-700' :
                    c.status === 'COMPLETED' ? 'bg-stone-100 text-stone-600' :
                    'bg-stone-100 text-stone-500'
                  }`}>
                    {c.status === 'DRAFT' ? 'Borrador' :
                     c.status === 'ACTIVE' ? 'Activa' :
                     c.status === 'PAUSED' ? 'Pausada' : 'Completada'}
                  </span>
                  <span className="font-mono text-xs text-stone-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 mb-4">
            <FolderOpen className="h-7 w-7 text-stone-400" />
          </div>
          <p className="text-stone-500 mb-2">No hay campañas aún</p>
          <p className="text-sm text-stone-400 mb-5">Crea tu primera campaña para empezar a organizar tus anuncios.</p>
          <Button variant="outline" onClick={() => setShowForm(true)}>
            Crear primera campaña
          </Button>
        </div>
      )}
    </div>
  )
}
