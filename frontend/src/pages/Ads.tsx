// ============================================================
// pages/Ads.tsx — Historial de anuncios del usuario
// ============================================================
// useMyAds() → hook que llama a GET /api/ads/my con TanStack Query.
//
// El hook devuelve { data, isLoading } donde:
//   - data: array de anuncios (o undefined si cargando)
//   - isLoading: true mientras se hace la petición
//
// Cada tarjeta de anuncio es clickeable → navega a /ads/:id

import { useMyAds } from '../hooks/useAds'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FileText, Plus, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Ads() {
  const { data: ads, isLoading } = useMyAds()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Encabezado con botón "Nuevo Anuncio" */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial de Anuncios</h1>
          <p className="text-gray-500">Todos los anuncios creados</p>
        </div>
        <Button onClick={() => navigate('/ads/new')}>
          <Plus className="h-4 w-4 mr-1" /> Nuevo Anuncio
        </Button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : ads && ads.length > 0 ? (
        // Grid de tarjetas de anuncios
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <Card
              key={ad.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/ads/${ad.id}`)}   // navega al detalle
            >
              {/* Miniatura del primer archivo */}
              {ad.media.length > 0 && (
                <div className="aspect-video overflow-hidden rounded-t-xl bg-gray-100">
                  {ad.media[0]!.mediaType === 'VIDEO' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-10 w-10 text-gray-400" />
                    </div>
                  ) : (
                    <img src={ad.media[0]!.url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
              )}
              <CardHeader>
                <h3 className="font-semibold text-gray-900 truncate">{ad.title}</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {ad.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{ad.description}</p>
                )}
                {/* Estado + cantidad de archivos */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className={`px-2 py-0.5 rounded-full ${
                    ad.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    ad.status === 'GENERATED' ? 'bg-blue-100 text-blue-700' :
                    ad.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {ad.status === 'DRAFT' ? 'Borrador' :
                     ad.status === 'GENERATED' ? 'Generado' :
                     ad.status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
                  </span>
                  <span>{ad.media.length} archivo{ad.media.length !== 1 ? 's' : ''}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Estado vacío (sin anuncios)
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-gray-500">No hay anuncios todavía</p>
          <Button className="mt-4" onClick={() => navigate('/ads/new')}>
            Crear primer anuncio
          </Button>
        </div>
      )}
    </div>
  )
}
