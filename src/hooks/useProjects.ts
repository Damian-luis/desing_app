'use client';

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Project, UserRole } from '@/lib/types'
import { useAuth } from '@/context/AuthContext'
import { ROLES } from '@/lib/constants';

export const useProjects = () => {
  const { user, role } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true)
      setError(null)
      
      let query = supabase.from('projects').select('*')

      if (role === ROLES.CLIENT) {
        query = query.eq('client_id', user.id)
      } else if (role === ROLES.DESIGNER) {
        query = query.eq('designer_id', user.id)
      }

      const { data, error: queryError } = await query

      if (queryError) {
        console.error('Error fetching projects:', queryError)
        throw queryError
      }

      console.log('Projects fetched:', data?.length, 'User role:', role)
      setProjects(data || [])
    } catch (err) {
      console.error('Error in fetchProjects:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [user, role]);

  useEffect(() => {
    if (user) {
      console.log('Fetching projects with role:', role, 'user id:', user.id)
      fetchProjects()
    }
  }, [fetchProjects, user, role])

  const refreshProjects = () => {
    fetchProjects()
  }

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'client_id' | 'status'>) => {
    try {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...project,
          client_id: user.id,
          status: 'pending',
        }])
        .select()

      if (error) throw error

      if (data) {
        setProjects(prev => [...prev, data[0]])
      }

      return data?.[0]
    } catch (err) {
      console.error('Error creating project:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error

      if (data) {
        setProjects(prev => 
          prev.map(project => 
            project.id === id ? { ...project, ...updates } : project
          )
        )
      }

      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      setProjects(prev => prev.filter(project => project.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }

  return { projects, loading, error, createProject, updateProject, deleteProject, refreshProjects }
}