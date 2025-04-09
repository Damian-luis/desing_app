'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, UserRole } from '@/lib/types'

type AuthContextType = {
  user: User | null
  role: UserRole | null
  userId: string | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  userId: null,
  isLoading: true,
  signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const createUserRecord = async (authUser: any) => {
    console.log("Creando registro de usuario para:", authUser.id)
    
    const { data: userData, error: userMetaError } = await supabase
      .from('auth.users')
      .select('raw_user_meta_data')
      .eq('id', authUser.id)
      .single()
    
    const userMeta = userData?.raw_user_meta_data || {}
    const userRole = userMeta.role || 'client'
    const fullName = userMeta.full_name || ''
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: authUser.id,
        email: authUser.email,
        role: userRole,
        full_name: fullName
      }])
      .select()
      .single()
      
    if (error) {
      console.error("Error al crear registro de usuario:", error)
      return null
    }
    
    console.log("Registro de usuario creado:", data)
    return data
  }

  const getUserData = async (authUser: any) => {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (userError) {
      console.log("Error al obtener datos de usuario:", userError)
      console.log("Intentando crear registro de usuario...")
      return await createUserRecord(authUser)
    }

    console.log("Datos de usuario encontrados:", userData)
    return userData
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser()

        if (error || !authUser) {
          console.log("No hay usuario autenticado o error:", error)
          setIsLoading(false)
          return
        }

        console.log("Usuario autenticado:", authUser)
        
        const userData = await getUserData(authUser)

        if (userData) {
          setUser(userData)
          setRole(userData.role)
        }
      } catch (err) {
        console.error("Error en fetchUser:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Evento de autenticación:", event)
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log("Usuario ha iniciado sesión:", session.user)
        
        const userData = await getUserData(session.user)

        if (userData) {
          setUser(userData)
          setRole(userData.role)
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("Usuario ha cerrado sesión")
        setUser(null)
        setRole(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      userId: user?.id || null,
      isLoading, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)