'use client'

import { useState } from 'react'
import { PublishModal } from './PublishModal'
import { trackEvent } from '../lib/analytics'

interface FixedActionBarProps {
  text: string
  isDefaultText: boolean
  qrCodeDataUrl: string | null
  onPaste: () => void
  onShare: () => void
  onCopyText?: () => void
  isModalOpen?: boolean
  onOpenModal?: () => void
  onCloseModal?: () => void
}

export function FixedActionBar({ 
  text, 
  isDefaultText, 
  qrCodeDataUrl, 
  onPaste, 
  onShare,
  onCopyText,
  isModalOpen = false,
  onOpenModal,
  onCloseModal
}: FixedActionBarProps) {

  return (
    <>
      {/* Fixed Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30 transition-opacity duration-200 ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex gap-2 max-w-md mx-auto">
          {/* Paste Button */}
          <button
            onClick={onPaste}
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-3 rounded-2xl transition-all duration-150 flex items-center justify-center gap-1 shadow-lg active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm">Paste</span>
          </button>

          {/* Copy Text Button */}
          {onCopyText && text && (
            <button
              data-copy-button
              onClick={onCopyText}
              className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-semibold py-3 px-3 rounded-2xl transition-all duration-150 flex items-center justify-center gap-1 shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Copy</span>
            </button>
          )}

          {/* Publish Button - only show if text is not default */}
          {!isDefaultText && text && (
            <button
              onClick={onOpenModal}
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-3 px-3 rounded-2xl transition-all duration-150 flex items-center justify-center gap-1 shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="text-sm">Publish</span>
            </button>
          )}

          {/* Share Button */}
          {qrCodeDataUrl && (
            <button
              onClick={onShare}
              className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold py-3 px-3 rounded-2xl transition-all duration-150 flex items-center justify-center gap-1 shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="text-sm">Share</span>
            </button>
          )}
        </div>
      </div>

      {/* Publish Modal */}
      {isModalOpen && (
        <PublishModal
          qrCodeDataUrl={qrCodeDataUrl}
          text={text}
          prefix={(() => {
            try {
              return process.env.NEXT_PUBLIC_QR_PREFIX || ''
            } catch {
              return ''
            }
          })()}
          onClose={onCloseModal}
        />
      )}
    </>
  )
}


