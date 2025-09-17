'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getLocaleFromPathname, isValidLocale } from '../lib/locales'

export function LocaleUpdater() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Get locale from current pathname
    if (typeof window !== 'undefined') {
      const currentLocale = getLocaleFromPathname(window.location.pathname)
      
      // Update i18n language if it's different from current
      if (isValidLocale(currentLocale) && i18n.language !== currentLocale) {
        i18n.changeLanguage(currentLocale)
      }
      
      // Update the HTML lang attribute
      document.documentElement.lang = currentLocale
    }
  }, [i18n])

  useEffect(() => {
    // Update the HTML lang attribute when the language changes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = i18n.language
    }
  }, [i18n.language])

  return null // This component doesn't render anything
}
