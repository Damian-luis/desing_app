'use client'

import { Project } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ROLES } from '@/lib/constants'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Eye, Pencil, Trash2, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { showErrorToast, showPromiseToast } from '@/lib/toast'
import { useLanguage } from '@/context/LanguageContext'

interface ProjectCardProps {
  project: Project
  onDelete?: (id: string) => Promise<void>
  hideViewButton?: boolean
}

export const ProjectCard = ({ project, onDelete, hideViewButton = false }: ProjectCardProps) => {
  const router = useRouter()
  const { role } = useAuth()
  const { t } = useLanguage()
  const [deleteDialog, setDeleteDialog] = useState(false)

  const handleDelete = async () => {
    if (onDelete) {
      try {
        await showPromiseToast(
          onDelete(project.id),
          {
            loading: t('projects.deleteConfirm'),
            success: t('projects.deleted'),
            error: t('projects.deleteError')
          }
        );
        setDeleteDialog(false)
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
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <CardDescription className="line-clamp-1 mt-1">
                {project.description || t('projects.noDescriptionProvided')}
              </CardDescription>
            </div>
            <div>{getStatusBadge(project.status)}</div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
          {project.designer && (
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-1" />
              <span>{t('projects.currentlyAssigned')} {project.designer.email}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-0">
          {!hideViewButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {t('projects.view')}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            {t('projects.edit')} ({role})
          </Button>
          
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialog(true)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t('projects.delete')} ({role})
            </Button>
          )}
        </CardFooter>
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
            <Button variant="destructive" onClick={handleDelete}>
              {t('projects.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}