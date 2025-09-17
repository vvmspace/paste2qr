'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trackEvent } from '../lib/analytics'

interface NavigationMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/wifi-qr-code-generator', label: 'WiFi QR Generator', icon: '📶' },
  { href: '/phone-number-qr-code', label: 'Phone QR Code', icon: '📞' },
  { href: '/email-qr-code-generator', label: 'Email QR Code', icon: '📧' },
  { href: '/sms-qr-code-maker', label: 'SMS QR Maker', icon: '💬' },
  { href: '/contact-info-qr-code', label: 'Contact QR Code', icon: '👤' },
]

export function NavigationMenu({ isOpen, onClose }: NavigationMenuProps) {
  const handleLinkClick = (href: string, label: string) => {
    trackEvent('navigation_click', { href, label })
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
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleLinkClick(item.href, item.label)}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 transition-colors group"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {item.label}
                </span>
                <svg 
                  className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-auto group-hover:text-gray-600 dark:group-hover:text-gray-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              QR Code Generator
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
              Create QR codes instantly
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
