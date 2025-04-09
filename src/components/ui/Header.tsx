'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { ModeToggle } from './mode-toggle'
import { LanguageToggle } from './language-toggle'
import { Button } from './button'
import { ROLES } from '@/lib/constants'
import { useEffect } from 'react'

export const Header = () => {
  const { user, signOut, role } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    console.log("Current user role:", role);
    console.log("ROLES.PROJECT_MANAGER value:", ROLES.PROJECT_MANAGER);
    console.log("Role comparison:", role === ROLES.PROJECT_MANAGER);
  }, [role]);

  return (
    <header className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          {t('common.designManager')}
        </Link>
        
        {user && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            <LanguageToggle />
            <ModeToggle />
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              {user.email} ({user.role})
            </span>
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              Log Out
            </Button>
            <Button
              onClick={signOut}
              variant="outline"
              size="icon"
              className="sm:hidden"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}