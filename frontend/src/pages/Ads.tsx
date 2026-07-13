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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-400 tracking-wider uppercase">Historial</p>
          <h1 className="font-display text-3xl font-bold text-stone-900 mt-1">Mis Anuncios</h1>
        </div>
        <Button onClick={() => navigate('/ads/new')}>
          <Plus className="h-4 w-4 mr-1.5" /> Nuevo Anuncio
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
        </div>
      ) : ads && ads.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <Card
              key={ad.id}
              className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              onClick={() => navigate(`/ads/${ad.id}`)}
            >
              {ad.media.length > 0 && (
                <div className="aspect-video overflow-hidden bg-stone-100">
                  {ad.media[0]!.mediaType === 'VIDEO' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-10 w-10 text-stone-400" />
                    </div>
                  ) : (
                    <img src={ad.media[0]!.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  )}
                </div>
              )}
              <CardHeader>
                <h3 className="font-display font-semibold text-stone-900 truncate">{ad.title}</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {ad.description && (
                  <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">{ad.description}</p>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium px-2.5 py-0.5 rounded-full ${
                    ad.status === 'APPROVED' ? 'bg-teal-50 text-teal-700' :
                    ad.status === 'GENERATED' ? 'bg-teal-50 text-teal-700' :
                    ad.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                    'bg-stone-100 text-stone-500'
                  }`}>
                    {ad.status === 'DRAFT' ? 'Borrador' :
                     ad.status === 'GENERATED' ? 'Generado' :
                     ad.status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
                  </span>
                  <span className="font-mono text-stone-400">{ad.media.length} archivo{ad.media.length !== 1 ? 's' : ''}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 mb-4">
            <FileText className="h-7 w-7 text-stone-400" />
          </div>
          <p className="text-stone-500 mb-2">No hay anuncios todavía</p>
          <p className="text-sm text-stone-400 mb-5">Crea tu primer anuncio con la ayuda de la inteligencia artificial.</p>
          <Button onClick={() => navigate('/ads/new')}>
            Crear primer anuncio
          </Button>
        </div>
      )}
    </div>
  )
}
