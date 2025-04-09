'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/context/LanguageContext'
import { sanitizeEmail, sanitizeString, isValidEmail } from '@/lib/utils'
import { ROLES } from '@/lib/constants'

export const RegisterForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('client')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Iniciando proceso de registro...')
      console.log('Datos ingresados:', { email, fullName, role })
      
      const sanitizedEmail = sanitizeEmail(email)
      const sanitizedFullName = sanitizeString(fullName)
      console.log('Datos sanitizados:', { 
        email: sanitizedEmail, 
        fullName: sanitizedFullName,
        role 
      })

      if (!isValidEmail(sanitizedEmail)) {
        console.log('Email inválido:', sanitizedEmail)
        throw new Error(t('errors.invalidEmail'))
      }

      if (!Object.values(ROLES).includes(role as typeof ROLES[keyof typeof ROLES])) {
        console.log('Rol inválido:', role)
        throw new Error(t('errors.invalidRole'))
      }

      console.log('Intentando registro con Supabase...')
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: sanitizeString(password),
        options: {
          data: {
            full_name: sanitizedFullName,
            role: role,
          }
        }
      })

      if (error) {
        console.error('Error en registro Supabase:', error)
        throw error
      }

      console.log('Registro exitoso:', data)
      console.log('Usuario:', data.user)
      console.log('Sesión:', data.session)

      // Insertar en la tabla users
      console.log('Insertando datos en tabla users...')
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user?.id,
            email: sanitizedEmail,
            full_name: sanitizedFullName,
            role: role,
          }
        ])

      if (insertError) {
        console.error('Error al insertar en tabla users:', insertError)
        throw insertError
      }

      console.log('Datos insertados correctamente en users')
      router.push('/dashboard')
    } catch (err) {
      console.error('Error completo del registro:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="fullName">{t('auth.fullName')}</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="off"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="off"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">{t('auth.password')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">{t('auth.role')}</Label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          autoComplete="off"
        >
          <option value="client">{t('auth.client')}</option>
          <option value="designer">{t('auth.designer')}</option>
          <option value="project_manager">{t('auth.projectManager')}</option>
        </select>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t('auth.registering') : t('auth.register')}
      </Button>
    </form>
  )
}