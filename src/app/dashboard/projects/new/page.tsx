'use client'

import { ProjectForm } from '@/components/projects/ProjectForm'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { ROLES } from '@/lib/constants'

export default function NewProjectPage() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.CLIENT, ROLES.PROJECT_MANAGER]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <ProjectForm />
      </div>
    </ProtectedRoute>
  )
}