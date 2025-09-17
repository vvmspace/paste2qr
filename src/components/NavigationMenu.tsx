'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { trackEvent } from '../lib/analytics'
import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'
import { getLocaleFromPathname, getLocalizedPathname } from '../lib/locales'

interface NavigationMenuProps {
  isOpen: boolean
  onClose: () => void
}

const iconClass = "w-5 h-5 text-slate-400 group-hover:text-slate-200 transition-colors";

const navigationItems = [
  { href: '/', labelKey: 'nav.home',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
      </svg>
    ) },
  { href: '/wifi-qr-code-generator', labelKey: 'nav.wifi',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 8.5A16 16 0 0112 5a16 16 0 019.5 3.5M5.5 12a11 11 0 016.5-2 11 11 0 016.5 2M8.5 15.5A6 6 0 0112 14a6 6 0 013.5 1.5M12 19.5h.01" />
      </svg>
    ) },
  { href: '/phone-number-qr-code', labelKey: 'nav.phone',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 5.5A2.5 2.5 0 016 3h2.5a1 1 0 011 1V7a1 1 0 01-1 1H7.5a1 1 0 00-.95.68 12.5 12.5 0 006.77 6.77 1 1 0 00.68-.95V13a1 1 0 011-1H19a1 1 0 011 1V18a2.5 2.5 0 01-2.5 2.5H17A16 16 0 013 7V6.5z" />
      </svg>
    ) },
  { href: '/email-qr-code-generator', labelKey: 'nav.email',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1zm0 0l8 6 8-6" />
      </svg>
    ) },
  { href: '/sms-qr-code-maker', labelKey: 'nav.sms',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16a1 1 0 011 1v8a1 1 0 01-1 1H8l-4 4V6a1 1 0 011-1z" />
      </svg>
    ) },
  { href: '/contact-info-qr-code', labelKey: 'nav.contact',
    icon: (
      <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0H5z" />
      </svg>
    ) },
]

export function NavigationMenu({ isOpen, onClose }: NavigationMenuProps) {
  const { t } = useTranslation()
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname() || '/'
  const currentLocale = getLocaleFromPathname(pathname)
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  // Handle swipe gestures for closing menu
  useEffect(() => {
    if (!isOpen) return

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
        if (deltaX < 0 && touchStartX.current < 100) {
          // Swipe left from left side - close menu
          onClose()
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
  }, [isOpen, onClose])

  // Close on outside click (additional safety on some mobile browsers)
  useEffect(() => {
    if (!isOpen) return

    const handlePointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null
      if (!menuRef.current) return
      if (target && menuRef.current.contains(target)) return
      onClose()
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('touchstart', handlePointer, { passive: true })

    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('touchstart', handlePointer)
    }
  }, [isOpen, onClose])

  const handleLinkClick = (href: string, labelKey: string) => {
    trackEvent('navigation_click', { href, label: t(labelKey) })
    onClose()
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu */}
      <div ref={menuRef} className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-r-3xl border-r border-gray-200/50 dark:border-slate-800/50" role="dialog" aria-modal="true" aria-label={t('nav.ariaMainMenu')}>
        <div className="p-6 pt-6">
          {/* Close button */}
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-full bg-transparent appearance-none hover:bg-gray-100/80 dark:hover:bg-gray-800/80 active:bg-gray-200/80 dark:active:bg-gray-700/80 transition-colors select-none"
              aria-label={t('nav.ariaCloseMenu')}
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1" aria-label="Primary">
            {navigationItems.map((item) => {
              const localizedHref = getLocalizedPathname(item.href, currentLocale)
              return (
              <Link
                key={item.href}
                href={localizedHref}
                onClick={() => handleLinkClick(localizedHref, item.labelKey)}
                className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group no-underline visited:no-underline hover:bg-gray-100 dark:hover:bg-slate-800 active:bg-gray-200 dark:active:bg-slate-700"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100 text-base visited:text-gray-800 dark:visited:text-gray-200">
                  {t(item.labelKey)}
                </span>
              </Link>
            )})}
          </nav>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200/50 dark:border-slate-700/50">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center font-medium">
              {t('nav.footerTitle')}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
              {t('nav.footerSubtitle')}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
