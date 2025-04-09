import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()


  console.log(`Middleware para la ruta: ${req.nextUrl.pathname}`)
  console.log(`Usuario autenticado: ${user ? 'Sí' : 'No'}`)

  const url = req.nextUrl.clone()
  const isAuthPage = url.pathname.startsWith('/login') || 
                     url.pathname.startsWith('/register') || 
                     url.pathname.startsWith('/auth/')

  if (!user && !isAuthPage && !url.pathname.startsWith('/')) {
    console.log('Redirigiendo a login por falta de autenticación')
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (user && isAuthPage) {
    console.log('Usuario ya autenticado, redirigiendo al dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}