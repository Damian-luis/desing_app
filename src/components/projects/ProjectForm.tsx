'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '@/lib/types'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { FileUploader } from '@/components/ui/file-uploader'
import { v4 as uuidv4 } from 'uuid'
import { sanitizeString } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

interface ProjectFormProps {
  initialData?: Project
}

export const ProjectForm = ({ initialData }: ProjectFormProps) => {
  const { t } = useLanguage()
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!user?.id) {
        throw new Error(t('errors.userNotAuthenticated'))
      }

      const sanitizedTitle = sanitizeString(title.trim())
      const sanitizedDescription = sanitizeString(description.trim())
      
      if (!sanitizedTitle) {
        throw new Error(t('errors.titleRequired'))
      }

      if (!sanitizedDescription) {
        throw new Error(t('errors.descriptionRequired'))
      }

      const bucketName = 'projects' 

      const fileUrls = await Promise.all(
        files.map(async (file) => {
          try {
            const fileExt = file.name.split('.').pop()
            const uniqueId = uuidv4()
            const fileName = `${uniqueId}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError, data } = await supabase.storage
              .from(bucketName)
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              })

            if (uploadError) {
              if (uploadError.message.includes('bucket not found') || 
                  uploadError.message.includes('row-level security')) {
                console.warn('Using fallback upload method without bucket/folder structure')
                
                
                return `/api/files/${fileName}` 
              }
              
              console.error('Upload error:', uploadError)
              throw new Error(`File upload failed: ${uploadError.message}`)
            }

            const { data: { publicUrl } } = supabase.storage
              .from(bucketName)
              .getPublicUrl(filePath)

            return publicUrl
          } catch (fileError) {
            console.error('File upload error:', fileError)
            return ''
          }
        })
      )

      const validFileUrls = fileUrls.filter(url => url)

      if (initialData) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({
            title: sanitizedTitle,
            description: sanitizedDescription,
            files: [...(initialData.files || []), ...validFileUrls],
            updated_at: new Date().toISOString(),
          })
          .eq('id', initialData.id)
          
        if (updateError) throw updateError
        
        router.push('/dashboard/projects')
      } else {
        const { error: insertError } = await supabase
          .from('projects')
          .insert([{
            title: sanitizedTitle,
            description: sanitizedDescription,
            files: validFileUrls,
            client_id: user.id,
            status: 'pending',
          }])
          
        if (insertError) {
          if (insertError.message?.includes('relation "projects" does not exist')) {
            setError('The projects table does not exist in the database. Please setup the database first using the "Setup Database" button on the dashboard.')
            console.error('Database error: Projects table does not exist')
          } else {
            throw insertError
          }
        } else {
          router.push('/dashboard/projects')
        }
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          {t('projects.title')}
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          {t('projects.description')}
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('projects.filesOptional')}
        </label>
        <FileUploader
          onFilesSelected={handleFilesSelected}
          maxFiles={5}
          maxSize={5 * 1024 * 1024} 
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
        />
        {files.length > 0 && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('projects.filesSelected', { count: files.length })}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t('projects.storagePermissionsNote')}
        </p>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-primary-700 dark:hover:bg-primary-600"
        >
          {loading ? t('common.loading') : initialData ? t('projects.updateProject') : t('projects.createNewProject')}
        </button>
      </div>
    </form>
  )
}