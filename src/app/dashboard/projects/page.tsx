'use client'

import { ProjectList } from '@/components/projects/ProjectList'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import Link from 'next/link'
import { ROLES } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'

export default function ProjectsPage() {
  const { role } = useAuth()

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Projects</h1>
          
          {role === ROLES.CLIENT && (
            <Link
              href="/dashboard/projects/new"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              New Project
            </Link>
          )}
        </div>
        
        <ProjectList />
      </div>
    </ProtectedRoute>
  )
}