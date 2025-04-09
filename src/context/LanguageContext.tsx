'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import es from '@/locales/es.json'
import en from '@/locales/en.json'

type Locale = 'es' | 'en'
type Translations = typeof es

interface LanguageContextType {
  locale: Locale
  translations: Translations
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const defaultLanguage: Locale = 'es'

const LanguageContext = createContext<LanguageContextType>({
  locale: defaultLanguage,
  translations: es,
  setLocale: () => {},
  t: () => '',
})

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [locale, setLocale] = useState<Locale>(defaultLanguage)
  const [translations, setTranslations] = useState<Translations>(es)

  useEffect(() => {
    const savedLocale = localStorage.getItem('language') as Locale | null
    
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'es')) {
      setLocale(savedLocale)
    } else {
      setLocale('es')
      localStorage.setItem('language', 'es')
    }
  }, [])

  useEffect(() => {
    setTranslations(locale === 'es' ? es : en)
    
    localStorage.setItem('language', locale)
  }, [locale])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value[k] === undefined) {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
      value = value[k]
    }
    
    return value
  }

  return (
    <LanguageContext.Provider value={{ locale, translations, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext) 