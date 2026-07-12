// ============================================================
// pages/AdEdit.tsx — Editar un anuncio existente
// ============================================================
// react-dropzone: se usa directamente aquí (a diferencia de
// la creación que usa FileUploader) para mayor control.
//
// El formulario se inicializa con los datos actuales del anuncio
// la primera vez que se renderiza (bandera initialized).

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAd, useUpdateAd, useUploadMedia, useDeleteMedia } from '../hooks/useAds'
import { useDropzone } from 'react-dropzone'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { ArrowLeft, Upload, X, Video, Save } from 'lucide-react'
import { cn } from '../utils/cn'

export default function AdEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: ad, isLoading } = useAd(Number(id))
  const updateAd = useUpdateAd()
  const uploadMedia = useUploadMedia()
  const deleteMedia = useDeleteMedia()

  // Estado local del formulario
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [initialized, setInitialized] = useState(false)  // ¿ya cargó datos?

  if (isLoading) return <p className="text-gray-500">Cargando...</p>
  if (!ad) return <p className="text-red-500">Anuncio no encontrado</p>

  // Inicializar el formulario con los datos del anuncio (solo una vez)
  if (!initialized) {
    setTitle(ad.title)
    setDescription(ad.description || '')
    setInitialized(true)
  }

  // Guardar cambios (PUT /api/ads/:id)
  const handleSave = () => {
    updateAd.mutate(
      { id: ad.id, data: { title, description } },
      { onSuccess: () => navigate(`/ads/${ad.id}`) },
    )
  }

  // Subir archivos (POST /api/ads/:id/media)
  const handleUpload = (files: File[]) => {
    uploadMedia.mutate({ adId: ad.id, files })
  }

  // Eliminar archivo (DELETE /api/ads/media/:mediaId)
  const handleDeleteMedia = (mediaId: number) => {
    if (window.confirm('¿Eliminar este archivo?')) {
      deleteMedia.mutate(mediaId)
    }
  }

  // Configuración de react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleUpload,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov'],
    },
    multiple: true,
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/ads/${ad.id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Editar Anuncio</h1>
          <p className="text-sm text-gray-500">Campaña: {ad.campaignName}</p>
        </div>
        <Button onClick={handleSave} isLoading={updateAd.isPending}>
          <Save className="h-4 w-4 mr-1" /> Guardar
        </Button>
      </div>

      {/* Formulario de detalles */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Detalles</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="title"
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Zona de archivos multimedia */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold">Archivos Multimedia</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dropzone para subir nuevos archivos */}
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50',
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">
              Arrastra archivos o haz clic para agregar más
            </p>
          </div>

          {/* Archivos existentes */}
          {ad.media.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ad.media.map((m) => (
                <div key={m.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                  {m.mediaType === 'VIDEO' ? (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <Video className="h-8 w-8 text-gray-400" />
                    </div>
                  ) : (
                    <img src={m.url} alt={m.originalName} className="aspect-video w-full object-cover" />
                  )}
                  {/* Botón X para eliminar (visible al hover) */}
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(m.id)}
                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="px-2 py-1 text-xs text-gray-500 truncate bg-white">
                    {m.originalName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
