'use client'

import { ProjectForm } from '@/components/projects/ProjectForm'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { useProjects } from '@/hooks/useProjects'
import { notFound } from 'next/navigation'
import { ROLES } from '@/lib/constants'

interface EditProjectPageProps {
  params: { id: string }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const { projects, loading } = useProjects()
  
  if (loading) return <div>Loading...</div>
  
  const project = projects.find(p => p.id === params.id)
  if (!project) return notFound()

  return (
    <ProtectedRoute allowedRoles={[ROLES.PROJECT_MANAGER, ROLES.CLIENT]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        <ProjectForm initialData={project} />
      </div>
    </ProtectedRoute>
  )
}