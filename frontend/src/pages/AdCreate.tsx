import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCampaigns } from '../hooks/useCampaigns'
import { useCreateAd, useUploadMedia, useGenerateCopy } from '../hooks/useAds'
import { FileUploader } from '../components/ads/FileUploader'
import { AdGeneratorForm } from '../components/ads/AdGeneratorForm'
import { AdPreview } from '../components/ads/AdPreview'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Sparkles } from 'lucide-react'
import type { Ad, GeneratedCopy } from '../types'

const steps = [
  { key: 'details' as const, label: 'Detalles' },
  { key: 'media' as const, label: 'Archivos' },
  { key: 'preview' as const, label: 'Previsualizar' },
]

export default function AdCreate() {
  const navigate = useNavigate()
  const { data: campaigns } = useCampaigns()
  const createAd = useCreateAd()
  const uploadMedia = useUploadMedia()
  const generateCopy = useGenerateCopy()

  const [stepIndex, setStepIndex] = useState(0)
  const [ad, setAd] = useState<Ad | null>(null)
  const [campaignId, setCampaignId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showGenerator, setShowGenerator] = useState(false)

  const handleCreateAd = async () => {
    if (!campaignId) return
    const result = await createAd.mutateAsync({
      campaignId: Number(campaignId),
      title: title || 'Nuevo anuncio',
      description,
    })
    setAd(result)
    setStepIndex(1)
  }

  const handleUpload = async (files: File[]) => {
    if (!ad) return
    const updated = await uploadMedia.mutateAsync({ adId: ad.id, files })
    setAd(updated)
    setStepIndex(2)
  }

  const handleGenerateCopy = async (prompt: string): Promise<GeneratedCopy> => {
    const result = await generateCopy.mutateAsync({
      prompt,
      mediaIds: ad?.media.map((m) => m.id) ?? [],
    })
    return result
  }

  const handleApplyCopy = async (copy: GeneratedCopy) => {
    setTitle(copy.title)
    setDescription(copy.description)
    setShowGenerator(false)
  }

  const isCreating = createAd.isPending || uploadMedia.isPending

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <p className="text-sm font-medium text-stone-400 tracking-wider uppercase">Creación</p>
        <h1 className="font-display text-3xl font-bold text-stone-900 mt-1">Crear Anuncio</h1>
      </div>

      <div className="flex gap-2">
        {steps.map((s, i) => {
          const isActive = i === stepIndex
          const isCompleted = i < stepIndex
          return (
            <div
              key={s.key}
              className={`flex-1 text-center py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm'
                  : isCompleted
                  ? 'bg-teal-50 text-teal-700'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              <span className="font-mono text-xs mr-1.5">{String(i + 1).padStart(2, '0')}</span>
              {s.label}
            </div>
          )
        })}
      </div>

      {stepIndex === 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-display font-semibold text-stone-900">Detalles del anuncio</h2>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label htmlFor="campaign" className="block text-sm font-medium text-stone-700 mb-1">
                Campaña
              </label>
              <select
                id="campaign"
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:border-teal-500 focus:ring-teal-500/30"
              >
                <option value="">Selecciona una campaña</option>
                {campaigns?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {(!campaigns || campaigns.length === 0) && (
                <p className="mt-1 text-xs text-hot-500">
                  No hay campañas disponibles. Crea una primero en la sección Campañas.
                </p>
              )}
            </div>

            <Input
              id="title"
              label="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del anuncio"
            />

            <div className="space-y-1">
              <label htmlFor="description" className="block text-sm font-medium text-stone-700">
                Descripción
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:border-teal-500 focus:ring-teal-500/30"
                placeholder="Descripción del anuncio (opcional)"
              />
            </div>

            {!showGenerator ? (
              <Button variant="outline" onClick={() => setShowGenerator(true)}>
                <Sparkles className="h-4 w-4 mr-1.5" /> Generar con IA
              </Button>
            ) : (
              <AdGeneratorForm onGenerate={handleGenerateCopy} onApply={handleApplyCopy} />
            )}

            <Button onClick={handleCreateAd} isLoading={isCreating} className="w-full" disabled={!campaignId}>
              Continuar a archivos
            </Button>
          </CardContent>
        </Card>
      )}

      {(stepIndex >= 1) && ad && (
        <>
          {stepIndex === 1 && (
            <Card>
              <CardHeader>
                <h2 className="font-display font-semibold text-stone-900">Subir fotos y videos</h2>
              </CardHeader>
              <CardContent>
                <FileUploader onUpload={handleUpload} isUploading={uploadMedia.isPending} />
              </CardContent>
            </Card>
          )}

          {stepIndex === 2 && (
            <div className="space-y-4">
              <AdPreview ad={ad} />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStepIndex(1)}>
                  Agregar más archivos
                </Button>
                <Button onClick={() => navigate(`/ads/${ad.id}`)}>
                  Ver anuncio
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {ad && stepIndex === 1 && ad.media.length > 0 && (
        <div className="text-center">
          <Button variant="secondary" onClick={() => setStepIndex(2)}>
            Previsualizar anuncio
          </Button>
        </div>
      )}
    </div>
  )
}
