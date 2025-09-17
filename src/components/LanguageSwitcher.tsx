'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { trackEvent } from '../lib/analytics'

interface LanguageSwitcherProps {
  currentLanguage?: string
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', hreflang: 'en' },
  { code: 'es', name: 'Español', flag: '🇪🇸', hreflang: 'es' },
  { code: 'zh', name: '中文', flag: '🇨🇳', hreflang: 'zh' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', hreflang: 'fr' },
]

export function LanguageSwitcher({ currentLanguage }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState('en')
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Update current locale from URL parameter
  useEffect(() => {
    const locale = searchParams.get('lang') || 'en'
    setCurrentLocale(locale)
  }, [searchParams])

  const currentLang = languages.find(lang => lang.code === currentLocale) || languages[0]

  const handleLanguageSelect = (languageCode: string) => {
    setIsOpen(false)
    
    // Create new URL with language parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', languageCode)
    const newUrl = `${pathname}?${params.toString()}`
    
    // Navigate to new URL
    router.push(newUrl)
    
    // Track analytics
    trackEvent('language_changed', { language: languageCode })
    
    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }

  return (
    <div className="relative" data-testid="language-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
        data-testid="language-button"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium text-gray-700">{currentLang.name}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50" data-testid="language-dropdown">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                language.code === currentLocale ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {language.code === currentLocale && (
                <svg className="w-4 h-4 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}