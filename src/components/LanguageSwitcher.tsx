'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { trackEvent, QR_EVENTS } from '../lib/analytics'
import i18n from '../lib/i18n-client'
import { useTranslation } from 'react-i18next'
import { getLocaleFromPathname, getLocalizedPathname } from '../lib/locales'

interface LanguageSwitcherProps {
  currentLanguage?: string
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', hreflang: 'en' },
  { code: 'es', name: 'Español', flag: '🇪🇸', hreflang: 'es' },
  { code: 'zh', name: '中文', flag: '🇨🇳', hreflang: 'zh' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', hreflang: 'fr' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹', hreflang: 'am' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', hreflang: 'pt' },
]

export function LanguageSwitcher({ currentLanguage }: LanguageSwitcherProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState('en')
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Update current locale from URL path
  useEffect(() => {
    const locale = getLocaleFromPathname(pathname || '/')
    setCurrentLocale(locale)
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [pathname])

  const currentLang = languages.find(lang => lang.code === currentLocale) || languages[0]

  const handleLanguageSelect = (languageCode: string) => {
    setIsOpen(false)
    
    // Build path-based localized URL
    const newPath = getLocalizedPathname(pathname || '/', languageCode as any)
    router.push(newPath)
    // Change i18n language
    i18n.changeLanguage(languageCode)
    
    // Track analytics
    trackEvent(QR_EVENTS.LANGUAGE_CHANGED(languageCode))
    
    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }

  // Close dropdown on outside click / touch / Escape
  useEffect(() => {
    if (!isOpen) return
    const handlePointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null
      if (!containerRef.current) return
      if (target && containerRef.current.contains(target)) return
      setIsOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('touchstart', handlePointer, { passive: true })
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('touchstart', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative" data-testid="language-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group w-12 h-12 md:w-10 md:h-10 rounded-full bg-transparent appearance-none flex items-center justify-center active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0"
        data-testid="language-button"
        aria-label={t('common.switchLanguageAria', { language: currentLang.name })}
        title={t('common.switchLanguageAria', { language: currentLang.name })}
      >
        <span className="text-3xl md:text-xl select-none">{currentLang.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50" data-testid="language-dropdown">
          {languages.map((language) => {
            const isActive = language.code === currentLocale
            return (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600 transition-colors first:rounded-t-xl last:rounded-b-xl text-gray-700 dark:text-gray-300 ${isActive ? 'font-semibold' : ''}`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {isActive && (
                  <svg className="w-4 h-4 ml-auto text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}