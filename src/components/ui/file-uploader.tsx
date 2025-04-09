'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  accept?: string
}

export const FileUploader = ({ 
  onFilesSelected, 
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, 
  accept = "*"
}: FileUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleFiles = (files: FileList | null) => {
    if (!files) return
    
    setError(null)
    const fileArray = Array.from(files)
    
    if (selectedFiles.length + fileArray.length > maxFiles) {
      const errorMsg = `You can only upload up to ${maxFiles} files`
      setError(errorMsg)
      showErrorToast({ message: errorMsg })
      return
    }
    
    const oversizedFiles = fileArray.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      const errorMsg = `Some files exceed the maximum size of ${maxSize / (1024 * 1024)}MB`
      setError(errorMsg)
      showErrorToast({ message: errorMsg })
      return
    }
    
    const newFiles = [...selectedFiles, ...fileArray]
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
    
    if (fileArray.length > 0) {
      showSuccessToast({ 
        title: "Files added", 
        message: `Added ${fileArray.length} file${fileArray.length > 1 ? 's' : ''}` 
      })
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    handleFiles(e.dataTransfer.files)
  }
  
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    const removedFile = newFiles[index]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
    
    showSuccessToast({ 
      message: `Removed ${removedFile.name}` 
    })
  }
  
  const openFileDialog = () => {
    inputRef.current?.click()
  }
  
  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag files here or click to select
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max {maxFiles} files, up to {maxSize / (1024 * 1024)}MB each
        </p>
        <input 
          type="file" 
          ref={inputRef} 
          multiple 
          className="hidden" 
          onChange={handleChange}
          accept={accept} 
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected files:</p>
          <ul className="space-y-1">
            {selectedFiles.map((file, i) => (
              <li key={i} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                <span className="truncate max-w-xs">{file.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(i)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 