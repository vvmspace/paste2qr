'use client'

import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

export function HeroContent() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Render static content during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="px-6 py-8 text-center hero-content" style={{ contain: 'layout style paint' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Paste to QR Code
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Paste any text from your clipboard and get a QR code instantly. No typing, no complexity - just paste and generate.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-8 text-center hero-content" style={{ contain: 'layout style paint' }}>
      <div className="max-w-2xl mx-auto">
        {/* Hero Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('hero.title')}
        </h2>
        
        {/* Hero Subtitle */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {t('hero.subtitle')}
        </p>
        
      </div>
    </div>
  )
}