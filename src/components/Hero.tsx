'use client'

import { useState, useEffect, useRef } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NavigationMenu } from './NavigationMenu'
import { ThemeToggle } from './ThemeToggle'
import { useTranslation } from 'react-i18next'

export function Hero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const { t } = useTranslation()

  // Handle swipe gestures
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current) return

      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchEndX - touchStartX.current
      const deltaY = touchEndY - touchStartY.current

      // Check if it's a horizontal swipe (not vertical scroll)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && touchStartX.current < 50) {
          // Swipe right from left edge - open menu
          setIsMenuOpen(true)
          if ('vibrate' in navigator) {
            navigator.vibrate(30)
          }
        }
      }

      touchStartX.current = 0
      touchStartY.current = 0
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <div className="bg-white dark:bg-slate-900 px-4 py-3 border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-10">
      <div className="flex items-center justify-between h-12">
        {/* Hamburger menu */}
        <button 
          className="p-2 -ml-2 rounded-full bg-transparent appearance-none hover:bg-gray-100/80 dark:hover:bg-slate-800/80 active:bg-gray-200/80 dark:active:bg-slate-700/80 transition-colors select-none"
          onClick={() => {
            setIsMenuOpen(true)
            // Haptic feedback
            if ('vibrate' in navigator) {
              navigator.vibrate(30)
            }
          }}
          aria-label={t('common.menu')}
        >
          <svg className="w-5 h-5 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Title */}
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
          {t('header.title')}
        </h1>
        
        {/* Right side controls */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>
      
      {/* Navigation Menu */}
      <NavigationMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </div>
  )
}









