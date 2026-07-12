// ============================================================
// components/ads/AdGeneratorForm.tsx — Generador de copy con IA
// ============================================================
// El usuario escribe un prompt, presiona "Generar" y la IA
// devuelve un título + descripción + sugerencias de imágenes.
// Luego puede aplicar el resultado al formulario principal.

import { useState } from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card, CardContent, CardHeader } from '../ui/Card'

// Estructura del resultado generado por la IA
interface GeneratedCopy {
  title: string
  description: string
  imageSuggestions: string[]
}

interface AdGeneratorFormProps {
  onGenerate: (prompt: string) => Promise<GeneratedCopy>  // llama al backend
  onApply: (copy: GeneratedCopy) => void                   // aplica el resultado
}

export function AdGeneratorForm({ onGenerate, onApply }: AdGeneratorFormProps) {
  const [prompt, setPrompt] = useState('')         // texto del prompt
  const [result, setResult] = useState<GeneratedCopy | null>(null)  // resultado IA
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
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Generar con IA</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input + botón generar */}
        <div className="flex gap-2">
          <Input
            id="prompt"
            placeholder="Describe el anuncio que quieres generar..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button onClick={handleGenerate} isLoading={isGenerating} className="shrink-0">
            <Sparkles className="h-4 w-4 mr-1" />
            Generar
          </Button>
        </div>

        {/* Resultado de la IA */}
        {result && (
          <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Título sugerido</p>
              <p className="text-sm font-medium text-gray-900">{result.title}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Descripción</p>
              <p className="text-sm text-gray-700">{result.description}</p>
            </div>
            {result.imageSuggestions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase">Sugerencias de imágenes</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.imageSuggestions.map((s, i) => (
                    <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full border border-blue-200 text-blue-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Botones: regenerar o aplicar */}
            <div className="flex gap-2 pt-2">
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
