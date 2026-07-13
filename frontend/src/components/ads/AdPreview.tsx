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
          <h3 className="font-display font-semibold text-stone-900">{ad.title}</h3>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {ad.media.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ad.media.map((m) => (
              <div key={m.id} className="aspect-video rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                {m.mediaType === 'VIDEO' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-8 w-8 text-stone-400" />
                  </div>
                ) : (
                  <img src={m.url} alt={m.originalName} className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        )}

        {ad.description && (
          <p className="text-sm text-stone-600 whitespace-pre-wrap leading-relaxed">{ad.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
