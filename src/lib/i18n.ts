import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '../locales/en.json'
import es from '../locales/es.json'
import zh from '../locales/zh.json'
import fr from '../locales/fr.json'

const resources = {
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  fr: { translation: fr },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: process.env.DEFAULT_LOCALE || 'en',
    lng: process.env.DEFAULT_LOCALE || 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n










