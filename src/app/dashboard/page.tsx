'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { useProjects } from '@/hooks/useProjects'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { FileText, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROLES } from '@/lib/constants'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function DashboardPage() {
  const { user, role } = useAuth()
  const { projects, loading, refreshProjects } = useProjects()
  const { t } = useLanguage()
  
  const pendingProjects = projects.filter(p => p.status === 'pending').length
  const inProgressProjects = projects.filter(p => p.status === 'in_progress').length
  const completedProjects = projects.filter(p => p.status === 'completed').length

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('dashboard.welcome')} {user?.full_name || user?.email}</h1>
          
          {role === ROLES.CLIENT && (
            <Link href="/dashboard/projects/new">
              <Button size="sm">
                {t('projects.createNewProject')}
              </Button>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalProjects')}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : projects.length}</div>
              <p className="text-xs text-muted-foreground">{t('dashboard.acrossAllStatuses')}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link 
                href="/dashboard/projects"
                className="text-xs text-primary hover:underline"
              >
                {t('dashboard.viewAllProjects')}
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.inProgress')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : inProgressProjects}</div>
              <p className="text-xs text-muted-foreground">{t('dashboard.activeProjects')}</p>
            </CardContent>
          </Card>
          
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.completed')}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : completedProjects}</div>
              <p className="text-xs text-muted-foreground">{t('dashboard.deliveredProjects')}</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>{t('dashboard.latestUpdates')}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : projects.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 5).map(project => (
                  <div key={project.id} className="flex items-center border-b border-border pb-2">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium">{project.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('dashboard.status')} {t(`statuses.${project.status}`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">No recent activity</p>
                {role === ROLES.CLIENT && (
                  <Link href="/dashboard/projects/new">
                    <Button size="sm">{t('projects.createNewProject')}</Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}