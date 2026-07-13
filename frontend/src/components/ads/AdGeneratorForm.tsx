import { useState } from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent, CardHeader } from '../ui/Card'

interface GeneratedCopy {
  title: string
  description: string
  imageSuggestions: string[]
}

interface AdGeneratorFormProps {
  onGenerate: (prompt: string) => Promise<GeneratedCopy>
  onApply: (copy: GeneratedCopy) => void
}

export function AdGeneratorForm({ onGenerate, onApply }: AdGeneratorFormProps) {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<GeneratedCopy | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    try {
      const copy = await onGenerate(prompt)
      setResult(copy)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-hot-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-hot-500">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <h3 className="font-display font-semibold text-stone-900">Generar con IA</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            id="prompt"
            placeholder="Describe el anuncio que quieres generar..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            onClick={handleGenerate}
            isLoading={isGenerating}
            className={`shrink-0 ${isGenerating ? 'animate-pulse' : ''}`}
            variant="primary"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Generar
          </Button>
        </div>

        {result && (
          <div className="space-y-3 rounded-lg border border-hot-200 bg-hot-50 p-4">
            <div>
              <p className="text-xs font-semibold tracking-wider text-hot-600 uppercase">Título sugerido</p>
              <p className="text-sm font-medium text-stone-900 mt-0.5">{result.title}</p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-hot-600 uppercase">Descripción</p>
              <p className="text-sm text-stone-700 mt-0.5 leading-relaxed">{result.description}</p>
            </div>
            {result.imageSuggestions.length > 0 && (
              <div>
                <p className="text-xs font-semibold tracking-wider text-hot-600 uppercase">Sugerencias de imágenes</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {result.imageSuggestions.map((s, i) => (
                    <span key={i} className="text-xs bg-white px-2.5 py-0.5 rounded-full border border-hot-200 text-hot-700 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={() => setResult(null)}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Regenerar
              </Button>
              <Button size="sm" onClick={() => onApply(result)}>
                Aplicar al anuncio
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
