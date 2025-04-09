'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useLanguage } from '@/context/LanguageContext'

export default function LoginPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background relative">
      <div className="absolute top-4 right-4 flex space-x-2">
        <LanguageToggle />
        <ModeToggle />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          {t('auth.signInToAccount')}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10 text-card-foreground">
          <LoginForm />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  {t('common.or')}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link 
                href="/register" 
                className="font-medium text-primary hover:text-primary/90"
              >
                {t('auth.createNewAccount')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 