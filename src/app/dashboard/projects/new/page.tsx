'use client'

import { ProjectForm } from '@/components/projects/ProjectForm'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { ROLES } from '@/lib/constants'
import { useLanguage } from '@/context/LanguageContext'

export default function NewProjectPage() {
  const { t } = useLanguage()

  return (
    <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('projects.createNewProject')}</h1>
        <ProjectForm />
      </div>
    </ProtectedRoute>
  )
}