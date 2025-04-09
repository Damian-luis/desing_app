'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/context/LanguageContext'
import { sanitizeEmail, sanitizeString, isValidEmail } from '@/lib/utils'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Iniciando proceso de login...')
      console.log('Email ingresado:', email)
      
      const sanitizedEmail = sanitizeEmail(email)
      console.log('Email sanitizado:', sanitizedEmail)
      
      if (!isValidEmail(sanitizedEmail)) {
        console.log('Email inválido:', sanitizedEmail)
        throw new Error(t('errors.invalidEmail'))
      }

      console.log('Intentando login con Supabase...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizeString(password),
      })
      
      if (error) {
        console.error('Error en login Supabase:', error)
        throw error
      }

      console.log('Login exitoso:', data)
      console.log('Usuario:', data.user)
      console.log('Sesión:', data.session)

      router.push('/dashboard')
    } catch (err) {
      console.error('Error completo del login:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
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
          autoComplete="off"
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t('auth.signingIn') : t('auth.signInButton')}
      </Button>
    </form>
  )
}