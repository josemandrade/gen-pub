import { useAuthStore } from '../store/authStore'
import { useCampaigns } from '../hooks/useCampaigns'
import { useMyAds } from '../hooks/useAds'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { Megaphone, FileText, Plus, Sparkles } from 'lucide-react'
import { cn } from '../utils/cn'

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const { data: campaigns } = useCampaigns()
  const { data: ads } = useMyAds()
  const navigate = useNavigate()

  const totalAds = ads?.length ?? 0
  const totalCampaigns = campaigns?.length ?? 0
  const pendingAds = ads?.filter((a) => a.status === 'DRAFT' || a.status === 'GENERATED').length ?? 0

  const stats = [
    { label: 'Campañas', value: totalCampaigns, icon: Megaphone, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Anuncios', value: totalAds, icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Pendientes', value: pendingAds, icon: Sparkles, color: 'text-hot-500', bg: 'bg-hot-50' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-stone-400 tracking-wider uppercase">Panel</p>
        <h1 className="font-display text-3xl font-bold text-stone-900 mt-1">
          Buen{user?.name ? user.name.includes('a') ? 'a' : 'os' : ''} días, {user?.name?.split(' ')[0] ?? 'usuario'}
        </h1>
        <p className="mt-1 text-stone-500">Resumen de tu actividad publicitaria</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-stone-500">{s.label}</span>
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', s.bg)}>
                  <s.icon className={cn('h-4 w-4', s.color)} />
                </div>
              </div>
              <p className={cn('font-display text-3xl font-bold', s.color)}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-stone-900">Crea un anuncio</h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Usa la inteligencia artificial para generar copy publicitario en segundos. Describe tu producto y deja que la IA haga el resto.
            </p>
            <Button onClick={() => navigate('/ads/new')}>
              <Plus className="h-4 w-4 mr-1.5" /> Nuevo Anuncio
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold text-stone-900">Gestiona campañas</h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Organiza tus anuncios en campañas y dales seguimiento. Crea, activa o pausa según necesites.
            </p>
            <Button variant="outline" onClick={() => navigate('/campaigns')}>
              <Megaphone className="h-4 w-4 mr-1.5" /> Ir a Campañas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


