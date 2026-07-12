// ============================================================
// components/ads/AdPreview.tsx — Vista previa de un anuncio
// ============================================================
// Componente que recibe un objeto "Ad" como prop y lo renderiza.
// Muestra el título, estado, archivos multimedia y descripción.

import type { Ad } from '../../types'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { Video } from 'lucide-react'

interface AdPreviewProps {
  ad: Ad
}

export function AdPreview({ ad }: AdPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{ad.title}</h3>
          {/* Badge de estado con colores según el valor */}
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grid de archivos multimedia */}
        {ad.media.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ad.media.map((m) => (
              <div key={m.id} className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                {m.mediaType === 'VIDEO' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                ) : (
                  <img src={m.url} alt={m.originalName} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Descripción */}
        {ad.description && (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{ad.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
