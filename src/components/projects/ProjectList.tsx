'use client'

import { Project } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { ProjectCard } from './ProjectCard'
import { useProjects } from '@/hooks/useProjects'
import { useAuth } from '@/context/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Eye, 
  Pencil, 
  Trash2, 
  FileText,
} from 'lucide-react'
import { ROLES } from '@/lib/constants'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { showSuccessToast, showErrorToast, showPromiseToast } from '@/lib/toast'
import { useLanguage } from '@/context/LanguageContext'

export const ProjectList = () => {
  const { projects, loading, error, deleteProject } = useProjects()
  const { role } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  if (loading) return (
    <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )
  
  if (error) return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-6">
        <p className="text-red-700">{error}</p>
      </CardContent>
    </Card>
  )

  if (projects.length === 0) return (
    <Card>
      <CardContent className="p-6 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">{t('projects.noProjects')}</h3>
        <p className="text-gray-500 mt-1">{t('projects.startCreating')}</p>
        {role === ROLES.CLIENT && (
          <Button 
            className="mt-4" 
            onClick={() => router.push('/dashboard/projects/new')}
          >
            {t('projects.createNewProject')}
          </Button>
        )}
      </CardContent>
    </Card>
  )

  const handleDelete = (id: string) => {
    setProjectToDelete(id)
    setDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (projectToDelete && deleteProject) {
      try {
        await showPromiseToast(
          deleteProject(projectToDelete),
          {
            loading: t('projects.deleting'),
            success: t('projects.deleted'),
            error: t('projects.deleteError')
          }
        );
        setDeleteDialog(false)
        setProjectToDelete(null)
      } catch (error) {
        console.error("Error deleting project:", error);
        showErrorToast({ 
          title: t('common.error'), 
          message: t('projects.deleteError')
        });
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">{t('statuses.pending')}</span>
      case 'in_progress':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{t('statuses.in_progress')}</span>
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">{t('statuses.completed')}</span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('projects.title')}</TableHead>
                <TableHead>{t('projects.status')}</TableHead>
                <TableHead>{t('projects.created')}</TableHead>
                <TableHead className="text-right">{t('projects.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusBadge(project.status)}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">{t('projects.view')}</span>
                      </Button>
                      
                      {role === ROLES.PROJECT_MANAGER && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t('projects.edit')}</span>
                        </Button>
                      )}
                      
                      {role === ROLES.PROJECT_MANAGER && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t('projects.delete')}</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('projects.deleteConfirm')}</DialogTitle>
            <DialogDescription>
              {t('projects.deleteWarning')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              {t('projects.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t('projects.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}