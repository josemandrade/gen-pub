import { useParams, useNavigate } from 'react-router-dom'
import { useAd, useDeleteAd } from '../hooks/useAds'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { ArrowLeft, Edit2, Trash2, Video, ExternalLink } from 'lucide-react'

export default function AdDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: ad, isLoading } = useAd(Number(id))
  const deleteAd = useDeleteAd()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    )
  }

  if (!ad) return <p className="text-red-500">Anuncio no encontrado</p>

  const handleDelete = () => {
    if (window.confirm('¿Eliminar este anuncio?')) {
      deleteAd.mutate(ad.id, { onSuccess: () => navigate('/ads') })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-400 tracking-wider uppercase">Detalle</p>
          <h1 className="font-display text-3xl font-bold text-stone-900 mt-1 truncate">{ad.title}</h1>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => navigate(`/ads/${ad.id}/edit`)}>
            <Edit2 className="h-4 w-4 mr-1" /> Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} isLoading={deleteAd.isPending}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          ad.status === 'APPROVED' ? 'bg-teal-50 text-teal-700' :
          ad.status === 'GENERATED' ? 'bg-teal-50 text-teal-700' :
          ad.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
          'bg-stone-100 text-stone-500'
        }`}>
          {ad.status === 'DRAFT' ? 'Borrador' :
           ad.status === 'GENERATED' ? 'Generado' :
           ad.status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
        </span>
        <span className="text-xs text-stone-400 font-mono">
          {ad.campaignName} &middot; Creado {new Date(ad.createdAt).toLocaleDateString()}
        </span>
      </div>

      {ad.description && (
        <Card>
          <CardHeader>
            <h2 className="font-display font-semibold text-stone-900">Descripción</h2>
          </CardHeader>
          <CardContent>
            <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">{ad.description}</p>
          </CardContent>
        </Card>
      )}

      {ad.media.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-display font-semibold text-stone-900">Archivos ({ad.media.length})</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ad.media.map((m) => (
                <div key={m.id} className="group relative rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                  {m.mediaType === 'VIDEO' ? (
                    <div className="aspect-video flex items-center justify-center">
                      <Video className="h-10 w-10 text-stone-400" />
                    </div>
                  ) : (
                    <img src={m.url} alt={m.originalName} className="aspect-video w-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <a href={m.url} target="_blank" rel="noopener noreferrer"
                       className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full shadow-md transition-opacity">
                      <ExternalLink className="h-4 w-4 text-stone-700" />
                    </a>
                  </div>
                  <div className="px-2 py-1 text-xs text-stone-500 truncate bg-white border-t border-stone-100 font-mono">
                    {m.originalName}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
