'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import QRCode from 'qrcode'
import { FixedActionBar } from './FixedActionBar'
import { trackEvent } from '../lib/analytics'
import { aliasToText } from '../lib/alias'
import { useTranslation } from 'react-i18next'
import { PageConfig } from '../configs/pages'

interface QRGeneratorProps {
  originalText?: string
  pageConfig?: PageConfig
}

export function QRGenerator({ originalText, pageConfig }: QRGeneratorProps = {}) {
  const { t } = useTranslation()
  const [text, setText] = useState('')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDefaultText, setIsDefaultText] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Default text - current page URL
  const [defaultText, setDefaultText] = useState('')

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const generateQRCode = useCallback(async (textToGenerate: string, isDefault: boolean) => {
    if (!textToGenerate.trim()) {
      setQrCodeDataUrl(null)
      return
    }
    
    setIsGenerating(true)
    try {
      // Get prefix from page config or environment (default empty as per requirements)
      // Get environment variables safely
      const getEnvVar = (key: string, defaultValue: string) => {
        try {
          return process.env[key] || defaultValue
        } catch {
          return defaultValue
        }
      }
      
      const prefix = pageConfig?.qrPrefix || getEnvVar('NEXT_PUBLIC_QR_PREFIX', '')
      const fullText = prefix + textToGenerate

      // Generate QR code with minimal error correction for shorter text
      const errorCorrectionLevel = fullText.length < 50 ? 'L' : fullText.length < 100 ? 'M' : 'Q'

      const dataUrl = await QRCode.toDataURL(fullText, {
        errorCorrectionLevel,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256 // Optimized size for better performance
      })

      setQrCodeDataUrl(dataUrl)
      trackEvent('qr_generated', { textLength: textToGenerate.length, isDefault: isDefault, hasPrefix: !!prefix })
    } catch (error) {
      console.error('Error generating QR code:', error)
      trackEvent('qr_generation_error', { error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setIsGenerating(false)
    }
  }, [])

  // Initialize default text on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href
      const currentPath = window.location.pathname || ''
      
      // For published QR pages, use originalText if provided, otherwise try to extract from alias
      if (currentPath.startsWith('/qr/')) {
        if (originalText) {
          setDefaultText(originalText)
        } else {
          // Extract alias from URL and try to convert back to text
          const alias = currentPath.replace('/qr/', '')
          try {
            const textFromAlias = aliasToText(alias)
            setDefaultText(textFromAlias)
          } catch (error) {
            // If alias conversion fails, use empty string
            setDefaultText('')
          }
        }
      } else if (pageConfig?.defaultText) {
        // Use default text from page configuration (highest priority)
        setDefaultText(pageConfig.defaultText)
      } else if (currentPath === '/' || currentPath === '/en' || currentPath === '/es' || currentPath === '/zh' || currentPath === '/fr' || currentPath === '/am' || currentPath === '/pt') {
        // Only set URL for main page and main locale pages
        setDefaultText(currentUrl)
      } else {
        // For all other pages (MDX pages, etc.), don't set default URL
        setDefaultText('')
      }
    }
  }, [originalText, pageConfig])

  // Initialize with default text and generate QR code
  useEffect(() => {
    if (defaultText) {
      setText(defaultText)
      setIsDefaultText(true)
    }
  }, [defaultText])

  // Auto-generate QR code when text changes (with debounce)
  useEffect(() => {
    if (text.trim()) {
      const timeoutId = setTimeout(() => {
        // Use requestIdleCallback for better performance
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => generateQRCode(text, isDefaultText))
        } else {
          generateQRCode(text, isDefaultText)
        }
      }, 200) // 200ms debounce as per requirements
      
      return () => clearTimeout(timeoutId)
    }
  }, [text, isDefaultText, generateQRCode])

  const handlePaste = useCallback(async () => {
    try {
      // Haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      // Check if clipboard API is available and has readText method
      if (navigator.clipboard && navigator.clipboard.readText) {
        try {
          const pastedText = await navigator.clipboard.readText()
          setText(pastedText)
          setIsDefaultText(pastedText === defaultText)
          trackEvent('text_pasted', { textLength: pastedText.length })
          
          // Focus on textarea after paste
          if (textareaRef.current) {
            textareaRef.current.focus()
          }
          return
        } catch (clipboardError) {
          console.warn('Clipboard API failed, trying fallback:', clipboardError)
        }
      }
      
      // Fallback for Safari and other browsers without clipboard API support
      // Focus on textarea and show instruction
      if (textareaRef.current) {
        textareaRef.current.focus()
        textareaRef.current.select()
        
        // Show instruction for manual paste
        const instruction = t('qr.pasteInstruction')
        if (instruction && instruction !== 'qr.pasteInstruction') {
          alert(instruction)
        } else {
          alert('Please paste your text using Cmd+V (Mac) or Ctrl+V (Windows/Linux)')
        }
      }
      
      trackEvent('text_paste_fallback_used')
    } catch (error) {
      console.error('Failed to handle paste:', error)
      alert(t('qr.clipboardError'))
    }
  }, [defaultText, t])

  const handleDownload = useCallback(() => {
    if (qrCodeDataUrl) {
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      const link = document.createElement('a')
      link.href = qrCodeDataUrl
      link.download = 'qrcode.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      trackEvent('qr_downloaded')
    }
  }, [qrCodeDataUrl])

  const handleCopy = useCallback(async () => {
    if (qrCodeDataUrl) {
      try {
        const response = await fetch(qrCodeDataUrl)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ])
        alert(t('qr.copied'))
        trackEvent('qr_copied')
      } catch (error) {
        console.error('Failed to copy QR code:', error)
        alert(t('qr.copyFailed'))
      }
    }
  }, [qrCodeDataUrl])

  const handleCopyText = useCallback(async () => {
    if (!text) return

    try {
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      await navigator.clipboard.writeText(text)
      trackEvent('text_copied', { textLength: text.length })
      
      // Show feedback
      const button = document.querySelector('[data-copy-button]') as HTMLElement
      if (button) {
        const originalText = button.textContent
        button.textContent = t('qr.copied')
        setTimeout(() => {
          button.textContent = originalText
        }, 1000)
      }
    } catch (error) {
      console.error('Failed to copy text:', error)
      alert('Unable to copy text. Please copy manually.')
    }
  }, [text])

  const handleShare = useCallback(async () => {
    if (!qrCodeDataUrl) return

    try {
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      const response = await fetch(qrCodeDataUrl)
      const blob = await response.blob()
      const file = new File([blob], 'qr-code.png', { type: 'image/png' })
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: t('qr.shareTitle'),
          text: t('qr.shareText'),
          files: [file]
        })
      } else {
        // Fallback to copy
        await handleCopy()
      }
      
      trackEvent('qr_shared')
    } catch (error) {
      console.error('Failed to share QR code:', error)
    }
  }, [qrCodeDataUrl, handleCopy])

  const handleClear = useCallback(() => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30)
    }
    
    setText('')
    setQrCodeDataUrl(null)
    setIsDefaultText(false)
    trackEvent('text_cleared')
    
    // Focus on textarea after clear
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Render static content during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="px-4 py-6 qr-generator-container" data-testid="qr-generator" style={{ contain: 'layout style paint' }}>
        {/* QR Code Display */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-200/50 dark:border-slate-700/50">
            <div className="w-64 h-64 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Enter text to generate QR</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Text Input */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 shadow-sm focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
            <textarea 
              placeholder="Paste any text from your clipboard to generate QR code..."
              className="w-full px-4 py-2 bg-transparent resize-none focus:outline-none transition-colors text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base leading-relaxed"
              rows={2}
              readOnly
            />
          </div>
        </div>
        
        {/* Fixed Action Bar */}
        <FixedActionBar 
          onPaste={handlePaste}
          onPublish={() => setIsModalOpen(true)}
          onCopy={handleCopyText}
          onClear={handleClear}
          hasText={false}
          hasQRCode={false}
        />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 qr-generator-container" data-testid="qr-generator" style={{ contain: 'layout style paint' }}>
      {/* QR Code Display */}
      <div className="text-center mb-8">
        {qrCodeDataUrl ? (
          <div className="inline-block p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 max-w-sm w-full">
            <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl mb-4">
              <img
                src={qrCodeDataUrl}
                alt={t('qr.alt')}
                className="w-64 h-64 mx-auto md:w-56 md:h-56"
                style={{ contain: 'layout style paint' }}
              />
            </div>
            <button
              onClick={handleDownload}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 py-3 px-4 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 active:scale-[0.98] appearance-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('common.download')}
            </button>
          </div>
        ) : (
          <div className="inline-block p-6 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-200/50 dark:border-slate-700/50">
            <div className="w-64 h-64 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('qr.generating')}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('qr.enterText')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Text Input */}
      <div className="mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200/50 dark:border-slate-700/50 shadow-sm focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => {
              const newValue = e.target.value
              setText(newValue)
              setIsDefaultText(newValue === defaultText)
            }}
            placeholder={t('qr.placeholder')}
            className="w-full px-4 py-2 bg-transparent resize-none focus:outline-none transition-colors text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base leading-relaxed"
            rows={2}
          />
        </div>
      </div>

      {/* Fixed Action Bar */}
      <FixedActionBar
        onPaste={handlePaste}
        onPublish={() => setIsModalOpen(true)}
        onCopy={handleCopyText}
        onClear={handleClear}
        hasText={!!text}
        hasQRCode={!!qrCodeDataUrl}
      />
    </div>
  )
}












