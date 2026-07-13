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

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [initialized, setInitialized] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    )
  }

  if (!ad) return <p className="text-red-500">Anuncio no encontrado</p>

  if (!initialized) {
    setTitle(ad.title)
    setDescription(ad.description || '')
    setInitialized(true)
  }

  const handleSave = () => {
    updateAd.mutate(
      { id: ad.id, data: { title, description } },
      { onSuccess: () => navigate(`/ads/${ad.id}`) },
    )
  }

  const handleUpload = (files: File[]) => {
    uploadMedia.mutate({ adId: ad.id, files })
  }

  const handleDeleteMedia = (mediaId: number) => {
    if (window.confirm('¿Eliminar este archivo?')) {
      deleteMedia.mutate(mediaId)
    }
  }

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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/ads/${ad.id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-400 tracking-wider uppercase">Edición</p>
          <h1 className="font-display text-3xl font-bold text-stone-900 mt-1 truncate">Editar Anuncio</h1>
        </div>
        <Button onClick={handleSave} isLoading={updateAd.isPending}>
          <Save className="h-4 w-4 mr-1" /> Guardar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-display font-semibold text-stone-900">Detalles</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="title"
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-display font-semibold text-stone-900">Archivos Multimedia</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
              isDragActive ? 'border-teal-500 bg-teal-50' : 'border-stone-300 hover:border-stone-400 bg-stone-50',
            )}
          >
            <input {...getInputProps()} />
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 mb-2">
              <Upload className="h-5 w-5 text-stone-400" />
            </div>
            <p className="text-sm text-stone-600">
              Arrastra archivos o haz clic para agregar más
            </p>
          </div>

          {ad.media.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ad.media.map((m) => (
                <div key={m.id} className="relative group rounded-lg overflow-hidden border border-stone-200">
                  {m.mediaType === 'VIDEO' ? (
                    <div className="aspect-video bg-stone-100 flex items-center justify-center">
                      <Video className="h-8 w-8 text-stone-400" />
                    </div>
                  ) : (
                    <img src={m.url} alt={m.originalName} className="aspect-video w-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(m.id)}
                    className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="px-2 py-1 text-xs text-stone-500 truncate bg-white border-t border-stone-100 font-mono">
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
