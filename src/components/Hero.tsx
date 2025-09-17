'use client'

import { useState } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NavigationMenu } from './NavigationMenu'

interface HeroProps {
  title: string
  subtitle: string
  buttonText: string
  gradient: string
}

export function Hero({ title }: { title: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <div className="bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Hamburger menu */}
        <button 
          className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
          onClick={() => {
            setIsMenuOpen(true)
            // Haptic feedback
            if ('vibrate' in navigator) {
              navigator.vibrate(30)
            }
          }}
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Title */}
        <h1 className="text-lg font-bold text-gray-900">
          {title}
        </h1>
        
            {/* Language Switcher */}
            <LanguageSwitcher />
      </div>
      
      {/* Navigation Menu */}
      <NavigationMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </div>
  )
}









