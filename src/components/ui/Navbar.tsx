'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { ROLES } from '@/lib/constants'

export const Navbar = () => {
  const pathname = usePathname()
  const { role } = useAuth()
  const { t } = useLanguage()

  const isActive = (path: string) => pathname === path

  const linkClass = (path: string) => {
    const baseClass = "px-3 py-2 rounded-md text-sm font-medium"
    if (isActive(path)) {
      return `${baseClass} bg-secondary/80 text-secondary-foreground`
    }
    return `${baseClass} text-secondary-foreground/90 hover:bg-secondary/70 hover:text-secondary-foreground transition-colors`
  }

  return (
    <nav className="bg-secondary dark:bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className={linkClass('/dashboard')}
            >
              {t('navbar.dashboard')}
            </Link>
            
            <Link 
              href="/dashboard/projects" 
              className={linkClass('/dashboard/projects')}
            >
              {t('navbar.projects')}
            </Link>
            
            {role === ROLES.CLIENT && (
              <Link 
                href="/dashboard/projects/new" 
                className={linkClass('/dashboard/projects/new')}
              >
                {t('navbar.newProject')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}