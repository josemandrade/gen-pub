// ============================================================
// pages/AdCreate.tsx — Creación de anuncio en 3 pasos
// ============================================================
// useState: hook para manejar estado local en componentes funcionales.
//   Acá se usa para: paso actual, datos del formulario, anuncio creado.
//
// El wizard (asistente) tiene 3 pasos:
//   1. Detalles: seleccionar campaña, título, descripción (o generar con IA)
//   2. Archivos: subir imágenes/videos
//   3. Previsualizar: ver el anuncio completo

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
import type { Ad, GeneratedCopy } from '../types'

export default function AdCreate() {
  const navigate = useNavigate()
  const { data: campaigns } = useCampaigns()           // lista de campañas
  const createAd = useCreateAd()                        // mutación crear
  const uploadMedia = useUploadMedia()                  // mutación subir archivos
  const generateCopy = useGenerateCopy()                // mutación generar copy

  // --- Estado del wizard ---
  const [step, setStep] = useState<'details' | 'media' | 'preview'>('details')
  const [ad, setAd] = useState<Ad | null>(null)          // anuncio creado
  const [campaignId, setCampaignId] = useState('')       // campaña seleccionada
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showGenerator, setShowGenerator] = useState(false) // mostrar IA?

  // Paso 1: Crear el anuncio (POST /api/ads)
  const handleCreateAd = async () => {
    if (!campaignId) return
    const result = await createAd.mutateAsync({
      campaignId: Number(campaignId),
      title: title || 'Nuevo anuncio',
      description,
    })
    setAd(result)      // guarda el anuncio creado
    setStep('media')   // avanza al paso 2
  }

  // Paso 2: Subir archivos (POST /api/ads/:id/media)
  const handleUpload = async (files: File[]) => {
    if (!ad) return
    const updated = await uploadMedia.mutateAsync({ adId: ad.id, files })
    setAd(updated)      // actualiza con los archivos subidos
    setStep('preview')  // avanza al paso 3
  }

  // Generar copy con IA (POST /api/ads/generate-copy)
  const handleGenerateCopy = async (prompt: string): Promise<GeneratedCopy> => {
    const result = await generateCopy.mutateAsync({
      prompt,
      mediaIds: ad?.media.map((m) => m.id) ?? [],
    })
    return result
  }

  // Aplicar el resultado de la IA al formulario
  const handleApplyCopy = async (copy: GeneratedCopy) => {
    setTitle(copy.title)
    setDescription(copy.description)
    setShowGenerator(false)
  }

  const isCreating = createAd.isPending || uploadMedia.isPending

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Anuncio</h1>
        <p className="text-gray-500">Completa los pasos para generar tu anuncio</p>
      </div>

      {/* ===== INDICADOR DE PASOS ===== */}
      <div className="flex gap-2">
        {['Detalles', 'Archivos', 'Previsualizar'].map((s, i) => {
          const stepKey = ['details', 'media', 'preview'][i] as typeof step
          return (
            <div
              key={s}
              className={`flex-1 text-center py-2 rounded-lg text-sm font-medium transition-colors ${
                step === stepKey
                  ? 'bg-blue-600 text-white'                                     // paso activo
                  : stepKey === 'details' && step !== 'details'
                  ? 'bg-blue-100 text-blue-700'                                  // completado
                  : stepKey === 'media' && (step === 'preview')
                  ? 'bg-blue-100 text-blue-700'                                  // completado
                  : 'bg-gray-100 text-gray-400'                                  // pendiente
              }`}
            >
              {i + 1}. {s}
            </div>
          )
        })}
      </div>

      {/* ===== PASO 1: DETALLES ===== */}
      {step === 'details' && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Detalles del anuncio</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selector de campaña */}
            <div>
              <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 mb-1">
                Campaña
              </label>
              <select
                id="campaign"
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una campaña</option>
                {campaigns?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {(!campaigns || campaigns.length === 0) && (
                <p className="mt-1 text-xs text-amber-600">
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
                placeholder="Descripción del anuncio (opcional)"
              />
            </div>

            {/* Generador con IA (toggle) */}
            {!showGenerator ? (
              <Button variant="outline" onClick={() => setShowGenerator(true)}>
                Generar con IA
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

      {/* ===== PASO 2 Y 3: ARCHIVOS / PREVIEW ===== */}
      {(step === 'media' || step === 'preview') && ad && (
        <>
          {step === 'media' && (
            <Card>
              <CardHeader>
                <h2 className="font-semibold">Subir fotos y videos</h2>
              </CardHeader>
              <CardContent>
                <FileUploader onUpload={handleUpload} isUploading={uploadMedia.isPending} />
              </CardContent>
            </Card>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              <AdPreview ad={ad} />
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('media')}>
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

      {/* Botón para ir a preview si ya tiene archivos */}
      {ad && step === 'media' && ad.media.length > 0 && (
        <div className="text-center">
          <Button onClick={() => setStep('preview')}>Previsualizar anuncio</Button>
        </div>
      )}
    </div>
  )
}
