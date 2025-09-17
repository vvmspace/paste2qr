'use client'

import { useTranslation } from 'react-i18next'

export function HeroContent() {
  const { t } = useTranslation()

  return (
    <div className="px-6 py-8 text-center">
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
