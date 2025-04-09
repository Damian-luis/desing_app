'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { useProjects } from '@/hooks/useProjects'
import { notFound, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, File, FileText, ImageIcon, CheckCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { ROLES } from '@/lib/constants'
import { supabase } from '@/lib/supabase'
import { User as UserType, UserRole, Project } from '@/lib/types'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

interface ProjectPageProps {
  params: { id: string }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectId = params.id
  
  const { projects, loading, updateProject } = useProjects()
  const { role, userId } = useAuth()
  const router = useRouter()
  const [designers, setDesigners] = useState<UserType[]>([])
  const [loadingDesigners, setLoadingDesigners] = useState(false)
  const [selectedDesigner, setSelectedDesigner] = useState<string>('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  
  useEffect(() => {
    if (role === ROLES.PROJECT_MANAGER) {
      fetchDesigners()
    }
  }, [role])
  
  const fetchDesigners = async () => {
    setLoadingDesigners(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role')
        .eq('role', 'designer')
      
      if (error) throw error
      
      setDesigners(data || [])
    } catch (error) {
      console.error('Error fetching designers:', error)
    } finally {
      setLoadingDesigners(false)
    }
  }
  
  const assignDesigner = async () => {
    if (!selectedDesigner || !project) return
    
    try {
      await updateProject(project.id, {
        designer_id: selectedDesigner,
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      
      showSuccessToast({
        title: 'Designer Assigned',
        message: 'Designer has been successfully assigned to this project and status updated to "In Progress".'
      })
    } catch (error) {
      console.error('Error assigning designer:', error)
      showErrorToast({
        title: 'Error',
        message: 'Failed to assign designer to this project.'
      })
    }
  }

  const markAsCompleted = async () => {
    if (!project) return
    
    setUpdatingStatus(true)
    try {
      await updateProject(project.id, {
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      
      showSuccessToast({
        title: 'Project Completed',
        message: 'Project has been marked as completed.'
      })
    } catch (error) {
      console.error('Error completing project:', error)
      showErrorToast({
        title: 'Error',
        message: 'Failed to mark project as completed.'
      })
    } finally {
      setUpdatingStatus(false)
    }
  }
  
  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase() || ''
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return 'image'
    } else if (extension === 'pdf') {
      return 'pdf'
    } else {
      return 'other'
    }
  }
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <ImageIcon className="h-6 w-6 text-blue-500" />
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const getAssignmentTime = (project: Project) => {
    if (project.updated_at) {
      return formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })
    }
    return 'Unknown time'
  }
  
  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
  
  const project = projects.find(p => p.id === projectId)
  if (!project) return notFound()

  const assignedDesigner = designers.find(d => d.id === project.designer_id)

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Project Details</h1>
          {role === ROLES.PROJECT_MANAGER && (
            <Button 
              variant="outline"
              onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
            >
              Edit Project
            </Button>
          )}
          
          {role === ROLES.DESIGNER && project.designer_id === userId && project.status !== 'completed' && (
            <Button 
              onClick={markAsCompleted}
              disabled={updatingStatus}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Completed
            </Button>
          )}
        </div>
        
        <ProjectCard project={project} hideViewButton={true} />
        
        {role === ROLES.PROJECT_MANAGER && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assign Designer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedDesigner}
                    onChange={(e) => setSelectedDesigner(e.target.value)}
                    disabled={loadingDesigners || !!project.designer_id}
                  >
                    <option value="">Select a designer</option>
                    {designers.map(designer => (
                      <option key={designer.id} value={designer.id}>
                        {designer.full_name || designer.email}
                      </option>
                    ))}
                  </select>
                  <Button 
                    onClick={assignDesigner} 
                    disabled={!selectedDesigner || loadingDesigners || !!project.designer_id}
                  >
                    Assign
                  </Button>
                </div>
                {project.designer_id && (
                  <div className="flex flex-col gap-1 px-4 py-3 bg-green-50 text-green-700 rounded-md">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        Currently assigned to: {assignedDesigner?.full_name || project.designer?.full_name || assignedDesigner?.email || project.designer?.email || project.designer_id}
                      </span>
                    </div>
                    <div className="text-sm text-green-600 ml-6">
                      Assigned {getAssignmentTime(project)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Project Files Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Files</CardTitle>
          </CardHeader>
          <CardContent>
            {project.files && project.files.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.files.map((file, index) => {
                  const fileType = getFileType(file)
                  return (
                    <div 
                      key={index} 
                      className="border rounded-md overflow-hidden flex flex-col"
                    >
                      <div className="p-4 bg-gray-50 flex items-center justify-center h-40 relative">
                        {fileType === 'image' ? (
                          <div className="relative w-full h-full">
                            <Image 
                              src={file} 
                              alt={`Project file ${index + 1}`}
                              fill
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                        ) : (
                          getFileIcon(fileType)
                        )}
                      </div>
                      <div className="p-3 border-t flex justify-between items-center">
                        <div className="truncate text-sm">
                          {file.split('/').pop()}
                        </div>
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No files attached to this project
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}