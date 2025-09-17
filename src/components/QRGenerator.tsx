'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import QRCode from 'qrcode'
import { FixedActionBar } from './FixedActionBar'
import { trackEvent } from '../lib/analytics'
import { aliasToText } from '../lib/alias'

interface QRGeneratorProps {
  originalText?: string
}

export function QRGenerator({ originalText }: QRGeneratorProps = {}) {
  const [text, setText] = useState('')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDefaultText, setIsDefaultText] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Default text - current page URL
  const [defaultText, setDefaultText] = useState('')

  const generateQRCode = useCallback(async (textToGenerate: string, isDefault: boolean) => {
    if (!textToGenerate.trim()) {
      setQrCodeDataUrl(null)
      return
    }
    
    setIsGenerating(true)
    try {
      // Get prefix from environment or config (default empty as per requirements)
      const prefix = process.env.NEXT_PUBLIC_QR_PREFIX || ''
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
        width: 160 // Smaller QR code for mobile
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
      const currentPath = window.location.pathname
      
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
      } else if (currentPath === '/' || currentPath === '/en' || currentPath === '/es' || currentPath === '/zh' || currentPath === '/fr') {
        // Only set URL for main page and main locale pages
        setDefaultText(currentUrl)
      } else {
        // For all other pages (MDX pages, etc.), don't set default URL
        setDefaultText('')
      }
    }
  }, [originalText])

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
        generateQRCode(text, isDefaultText)
      }, 500) // 500ms debounce
      
      return () => clearTimeout(timeoutId)
    }
  }, [text, isDefaultText, generateQRCode])

  const handlePaste = useCallback(async () => {
    try {
      // Haptic feedback for mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      const pastedText = await navigator.clipboard.readText()
      setText(pastedText)
      setIsDefaultText(pastedText === defaultText)
      trackEvent('text_pasted', { textLength: pastedText.length })
      
      // Focus on textarea after paste
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    } catch (error) {
      console.error('Failed to read clipboard contents:', error)
      alert('Unable to access clipboard. Please paste manually.')
    }
  }, [defaultText])

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
        alert('QR Code copied to clipboard!')
        trackEvent('qr_copied')
      } catch (error) {
        console.error('Failed to copy QR code:', error)
        alert('Failed to copy QR code. Please try downloading it instead.')
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
        button.textContent = 'Copied!'
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
          title: 'QR Code',
          text: 'Check out this QR code!',
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

  return (
    <div className="px-4 py-4">
      {/* QR Code Display */}
      <div className="text-center mb-6">
        {qrCodeDataUrl ? (
          <div className="inline-block p-3 bg-white border-2 border-gray-200 rounded-3xl shadow-lg">
            <img
              src={qrCodeDataUrl}
              alt="Generated QR Code"
              className="w-40 h-40 mx-auto"
            />
            <button
              onClick={handleDownload}
              className="mt-3 w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-2 px-4 rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
          </div>
        ) : (
          <div className="inline-block p-3 bg-gray-100 border-2 border-gray-200 rounded-3xl">
            <div className="w-40 h-40 bg-gray-200 rounded-2xl flex items-center justify-center">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-gray-500 font-medium">Generating...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span className="text-xs text-gray-500 font-medium">Enter text to generate QR</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Text Input */}
      <div className="mb-6">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            const newValue = e.target.value
            setText(newValue)
            setIsDefaultText(newValue === defaultText)
          }}
              placeholder="Paste any text from your clipboard to generate QR code..."
          className="w-full px-4 py-4 border-2 border-gray-200 rounded-3xl resize-none focus:border-blue-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400 text-base"
          rows={3}
        />
      </div>

      {/* Fixed Action Bar */}
      <FixedActionBar
        text={text}
        isDefaultText={isDefaultText}
        qrCodeDataUrl={qrCodeDataUrl}
        onPaste={handlePaste}
        onShare={handleShare}
        onCopyText={handleCopyText}
        isModalOpen={isModalOpen}
        onOpenModal={() => setIsModalOpen(true)}
        onCloseModal={() => setIsModalOpen(false)}
      />
    </div>
  )
}












