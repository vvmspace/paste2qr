import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['en', 'es', 'zh', 'fr', 'am', 'pt'],
    fallbackLng: getDefaultLocale(),
    lng: getDefaultLocale(),
    debug: getNodeEnv(),
    
    detection: {
      order: ['path', 'querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n










