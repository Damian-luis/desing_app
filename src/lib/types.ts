export type UserRole = 'client' | 'designer' | 'project_manager'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name?: string
}

export interface Project {
  id: string
  title: string
  description: string
  files: string[]
  created_at: string
  updated_at: string
  client_id: string
  designer_id?: string
  designer?: User
  status: 'pending' | 'in_progress' | 'completed'
}