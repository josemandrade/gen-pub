import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Video } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'

interface FilePreview {
  file: File
  preview: string
}

interface FileUploaderProps {
  onUpload: (files: File[]) => void
  isUploading?: boolean
  acceptedFiles?: Record<string, string[]>
}

const defaultAccept = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  'video/*': ['.mp4', '.webm', '.mov'],
}

export function FileUploader({ onUpload, isUploading, acceptedFiles = defaultAccept }: FileUploaderProps) {
  const [files, setFiles] = useState<FilePreview[]>([])

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [
      ...prev,
      ...accepted.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      })),
    ])
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index]!.preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const handleUpload = () => {
    if (files.length === 0) return
    onUpload(files.map((f) => f.file))
    setFiles([])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles,
    multiple: true,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-teal-500 bg-teal-50'
            : 'border-stone-300 hover:border-stone-400 bg-stone-50',
        )}
      >
        <input {...getInputProps()} />
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 mb-3">
          <Upload className="h-6 w-6 text-stone-400" />
        </div>
        <p className="text-sm text-stone-600">
          {isDragActive
            ? 'Suelta los archivos aquí...'
            : 'Arrastra imágenes o videos aquí, o haz clic para seleccionar'}
        </p>
        <p className="mt-1 text-xs text-stone-400">PNG, JPG, GIF, WEBP, MP4, WEBM, MOV</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {files.map((file, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-stone-200">
                {file.file.type.startsWith('video') ? (
                  <div className="aspect-video bg-stone-100 flex items-center justify-center">
                    <Video className="h-8 w-8 text-stone-400" />
                  </div>
                ) : (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="aspect-video object-cover w-full"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="px-2 py-1 text-xs text-stone-500 truncate bg-white border-t border-stone-100 font-mono">
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
