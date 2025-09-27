'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { NavigationMenu } from './NavigationMenu'
import { trackEvent, QR_EVENTS } from '../lib/analytics'

// Function to get localized title based on locale
function getLocalizedTitle(locale?: string) {
  const titles: Record<string, string> = {
    'en': 'Paste to QR Code',
    'es': 'Pegar a Código QR',
    'zh': '粘贴到二维码',
    'fr': 'Coller vers Code QR',
    'am': 'ወደ QR ኮድ ለጥፍ',
    'pt': 'Colar para Código QR'
  }
  
  return titles[locale || 'en'] || 'Paste to QR Code'
}

interface NavigationProps {
  locale?: string
}

export function Navigation({ locale }: NavigationProps = {}) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Render static content during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200/50 dark:border-slate-700/50 z-50 transition-colors duration-200">
        <div className="px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              className="p-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Center title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {getLocalizedTitle(locale)}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200">
              <span className="text-sm font-medium">EN</span>
            </button>
            <button className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </button>
          </div>
        </div>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200/50 dark:border-slate-700/50 z-50 transition-colors duration-200">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setIsMenuOpen(true)
                trackEvent(QR_EVENTS.MENU_OPENED())
              }}
              className="p-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <NavigationMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
          </div>
          
          {/* Center title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {t('header.title')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
