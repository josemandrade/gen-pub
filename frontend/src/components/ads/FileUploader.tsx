// ============================================================
// components/ads/FileUploader.tsx — Zona de subida de archivos
// ============================================================
// react-dropzone: librería que detecta arrastrar-soltar archivos
// y también ofrece un selector de archivos nativo.
//
// useState: hook para estado local (archivos seleccionados).
// useCallback: hook que memoiza la función para no recrearla
//   en cada renderizado (optimización).
//
// URL.createObjectURL: crea una URL temporal para previsualizar
//   el archivo localmente antes de subirlo.

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileImage, Video } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'

// Estructura interna: archivo + preview URL
interface FilePreview {
  file: File
  preview: string
}

interface FileUploaderProps {
  onUpload: (files: File[]) => void   // callback cuando se suben
  isUploading?: boolean
  acceptedFiles?: Record<string, string[]>  // tipos de archivo aceptados
}

const defaultAccept = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  'video/*': ['.mp4', '.webm', '.mov'],
}

export function FileUploader({ onUpload, isUploading, acceptedFiles = defaultAccept }: FileUploaderProps) {
  // Estado: lista de archivos seleccionados (aún no subidos)
  const [files, setFiles] = useState<FilePreview[]>([])

  // onDrop: se llama cuando el usuario suelta archivos en la zona
  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...accepted.map((file) => ({
        file,
        preview: URL.createObjectURL(file),   // URL temporal para preview
      })),
    ])
  }, [])

  // Elimina un archivo de la selección
  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index]!.preview)  // libera memoria
      updated.splice(index, 1)
      return updated
    })
  }

  // Sube todos los archivos seleccionados
  const handleUpload = () => {
    if (files.length === 0) return
    onUpload(files.map((f) => f.file))
    setFiles([])   // limpia la selección
  }

  // react-dropzone: getRootProps y getInputProps se esparcen
  // en los elementos JSX correspondientes
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles,
    multiple: true,
  })

  return (
    <div className="space-y-4">
      {/* Zona de arrastre */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-blue-500 bg-blue-50'    // cuando arrastra sobre la zona
            : 'border-gray-300 hover:border-gray-400 bg-gray-50',
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-10 w-10 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Suelta los archivos aquí...'
            : 'Arrastra imágenes o videos aquí, o haz clic para seleccionar'}
        </p>
        <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF, WEBP, MP4, WEBM, MOV</p>
      </div>

      {/* Vista previa de archivos seleccionados */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {files.map((file, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200">
                {file.file.type.startsWith('video') ? (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                ) : (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="aspect-video object-cover w-full"
                  />
                )}
                {/* Botón de eliminar (visible al hover) */}
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="px-2 py-1 text-xs text-gray-500 truncate bg-white">
                  {file.file.name}
                </div>
              </div>
            ))}
          </div>
          <Button type="button" onClick={handleUpload} isLoading={isUploading} className="w-full">
            Subir {files.length} archivo{files.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  )
}
