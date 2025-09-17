'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function LocaleUpdater() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Update the HTML lang attribute when the language changes
    if (typeof document !== 'undefined') {
      document.documentElement.lang = i18n.language
    }
  }, [i18n.language])

  return null // This component doesn't render anything
}
