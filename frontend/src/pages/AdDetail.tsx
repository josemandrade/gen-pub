// ============================================================
// pages/AdDetail.tsx — Detalle de un anuncio
// ============================================================
// useParams: hook de React Router que obtiene parámetros de
//   la URL definidos con ":id" en la ruta (ej: /ads/5 → id=5)
//
// useNavigate: hook para navegar programáticamente
//   (ej: después de eliminar, redirige a /ads)

import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAd, useDeleteAd } from '../hooks/useAds'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { ArrowLeft, Edit2, Trash2, Video, ExternalLink } from 'lucide-react'

export default function AdDetail() {
  const { id } = useParams()                    // obtiene :id de la URL
  const navigate = useNavigate()
  const { data: ad, isLoading } = useAd(Number(id))   // llama a GET /api/ads/:id
  const deleteAd = useDeleteAd()

  // Mientras carga...
  if (isLoading) return <p className="text-gray-500">Cargando...</p>
  // Si no existe...
  if (!ad) return <p className="text-red-500">Anuncio no encontrado</p>

  const handleDelete = () => {
    if (window.confirm('¿Eliminar este anuncio?')) {
      deleteAd.mutate(ad.id, { onSuccess: () => navigate('/ads') })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado con botones de acción */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{ad.title}</h1>
          <p className="text-sm text-gray-500">Campaña: {ad.campaignName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/ads/${ad.id}/edit`)}>
            <Edit2 className="h-4 w-4 mr-1" /> Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} isLoading={deleteAd.isPending}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Estado y fecha */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          ad.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
          ad.status === 'GENERATED' ? 'bg-blue-100 text-blue-700' :
          ad.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {ad.status === 'DRAFT' ? 'Borrador' :
           ad.status === 'GENERATED' ? 'Generado' :
           ad.status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
        </span>
        <span className="text-xs text-gray-400">
          Creado {new Date(ad.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Descripción */}
      {ad.description && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Descripción</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{ad.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Archivos multimedia */}
      {ad.media.length > 0 && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Archivos ({ad.media.length})</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ad.media.map((m) => (
                <div key={m.id} className="group relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {m.mediaType === 'VIDEO' ? (
                    <div className="aspect-video flex items-center justify-center">
                      <Video className="h-10 w-10 text-gray-400" />
                    </div>
                  ) : (
                    <img src={m.url} alt={m.originalName} className="aspect-video w-full object-cover" />
                  )}
                  {/* Overlay al hover: botón para abrir en nueva pestaña */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <a href={m.url} target="_blank" rel="noopener noreferrer"
                       className="opacity-0 group-hover:opacity-100 p-2 bg-white rounded-full shadow">
                      <ExternalLink className="h-4 w-4 text-gray-700" />
                    </a>
                  </div>
                  <div className="px-2 py-1 text-xs text-gray-500 truncate bg-white">
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
