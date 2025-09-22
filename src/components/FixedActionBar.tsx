'use client'

import { useState, useEffect } from 'react'
import { trackEvent } from '../lib/analytics'
import { useTranslation } from 'react-i18next'

interface FixedActionBarProps {
  onPaste: () => void
  onPublish: () => void
  onCopy?: () => void
  onClear?: () => void
  onShare?: () => void
  hasText?: boolean
  hasQRCode?: boolean
  hasUserInteracted?: boolean
}

export function FixedActionBar({ 
  onPaste, 
  onPublish,
  onCopy,
  onClear,
  onShare,
  hasText = false,
  hasQRCode = false,
  hasUserInteracted = false
}: FixedActionBarProps) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Render static content during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200/50 dark:border-slate-700/50 p-4 pb-6 z-30 transition-opacity duration-200 opacity-100">
        <div className="flex gap-2 max-w-md mx-auto">
          <button className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 py-3 px-4 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 active:scale-[0.98] appearance-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm font-medium">Paste</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200/50 dark:border-slate-700/50 p-4 pb-6 z-30 transition-opacity duration-200 opacity-100">
      <div className="flex gap-2 max-w-md mx-auto">
        {/* Paste Button */}
        <button
          onClick={onPaste}
          className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 py-3 px-4 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 active:scale-[0.98] appearance-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-sm font-medium">{t('common.paste')}</span>
        </button>

        {/* Copy Button */}
        {onCopy && hasText && hasUserInteracted && (
          <button
            onClick={onCopy}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 py-3 px-4 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 active:scale-[0.98] appearance-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">{t('common.copy')}</span>
          </button>
        )}

        {/* Publish Button */}
        {onPublish && hasText && hasUserInteracted && (
          <button
            onClick={onPublish}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 py-3 px-4 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 active:scale-[0.98] appearance-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="text-sm font-medium">{t('common.publish')}</span>
          </button>
        )}

        {/* Share Button */}
        {onShare && hasQRCode && hasUserInteracted && (
          <button
            onClick={onShare}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 py-3 px-4 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 active:scale-[0.98] appearance-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-sm font-medium">{t('common.share')}</span>
          </button>
        )}

        {/* Clear Button */}
        {onClear && hasText && hasUserInteracted && (
          <button
            onClick={onClear}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 py-3 px-4 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 active:scale-[0.98] appearance-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm font-medium">{t('common.clear')}</span>
          </button>
        )}
      </div>
    </div>
  )
}