'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { trackPageView } from '../lib/analytics'

export function Analytics() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Only track if i18n is available and window is defined
    if (typeof window === 'undefined' || !i18n) {
      return
    }

    try {
      // Track page view on mount
      trackPageView(window.location.pathname, { language: i18n.language || 'en' })

      // Track language changes
      const handleLanguageChange = (lng: string) => {
        trackPageView(window.location.pathname, { language: lng })
      }

      i18n.on('languageChanged', handleLanguageChange)

      return () => {
        i18n.off('languageChanged', handleLanguageChange)
      }
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }, [i18n])

  // This component doesn't render anything
  return null
}










