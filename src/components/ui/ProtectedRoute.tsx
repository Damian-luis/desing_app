'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("ProtectedRoute - user:", user, "role:", role, "isLoading:", isLoading)
    
    if (!isLoading && !user) {
      console.log("Usuario no autenticado, redirigiendo a login")
      router.push('/login')
    }

    if (!isLoading && user && allowedRoles && !allowedRoles.includes(role!)) {
      console.log(`Usuario no tiene permiso (rol: ${role}), roles permitidos:`, allowedRoles)
      router.push('/dashboard')
    }
  }, [user, isLoading, role, allowedRoles, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
        <p className="mt-4 text-lg">Cargando...</p>
      </div>
    </div>
  }
  
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Redirigiendo al inicio de sesión...</p>
      </div>
    </div>
  }
  
  if (allowedRoles && !allowedRoles.includes(role!)) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg text-red-600">No tienes permiso para acceder a esta página</p>
      </div>
    </div>
  }

  return <>{children}</>
}