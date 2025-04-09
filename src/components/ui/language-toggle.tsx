'use client'

import * as React from 'react'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/context/LanguageContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-none">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLocale('es')}
          className={locale === 'es' ? 'bg-accent text-accent-foreground' : ''}
        >
          {t('language.es')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLocale('en')}
          className={locale === 'en' ? 'bg-accent text-accent-foreground' : ''}
        >
          {t('language.en')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 