'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trackPageView } from '../lib/analytics'

export function Analytics() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Track page view on mount
    trackPageView(window.location.pathname, i18n.language)

    // Track language changes
    const handleLanguageChange = (lng: string) => {
      trackPageView(window.location.pathname, lng)
    }

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  // This component doesn't render anything
  return null
}










