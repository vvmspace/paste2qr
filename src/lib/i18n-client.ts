// Client-side i18n configuration
// This file is safe to import in client components

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../locales/en.json'
import es from '../locales/es.json'
import zh from '../locales/zh.json'
import fr from '../locales/fr.json'
import am from '../locales/am.json'
import pt from '../locales/pt.json'

const resources = {
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  fr: { translation: fr },
  am: { translation: am },
  pt: { translation: pt },
}

// Get default locale safely
const getDefaultLocale = () => {
  try {
    return process.env.DEFAULT_LOCALE || 'en'
  } catch {
    return 'en'
  }
}

const getNodeEnv = () => {
  try {
    return process.env.NODE_ENV === 'development'
  } catch {
    return false
  }
}

// Get locale from URL pathname
const getLocaleFromURL = () => {
  if (typeof window === 'undefined') {
    return getDefaultLocale()
  }
  
  const pathname = window.location.pathname
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  const supportedLocales = ['en', 'es', 'zh', 'fr', 'am', 'pt']
  if (supportedLocales.includes(firstSegment)) {
    return firstSegment
  }
  
  return getDefaultLocale()
}

// Only initialize if not already initialized
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      supportedLngs: ['en', 'es', 'zh', 'fr', 'am', 'pt'],
      fallbackLng: getDefaultLocale(),
      lng: getLocaleFromURL(), // Use URL-based locale
      debug: getNodeEnv(),
      
      interpolation: {
        escapeValue: false,
      },
      
      // Disable client-side language detection
      react: {
        useSuspense: false,
      },
    })
}

export default i18n