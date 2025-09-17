'use client'

import { useState } from 'react'
import { trackEvent } from '../lib/analytics'

interface PublishModalProps {
  qrCodeDataUrl: string | null
  text: string
  prefix: string
  onClose: () => void
}

export function PublishModal({ qrCodeDataUrl, text, prefix, onClose }: PublishModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'en'
  })
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!qrCodeDataUrl) return

    setIsPublishing(true)
    setError(null)

    try {
      const { clientStorage } = await import('../lib/clientStorage')
      
      const result = await clientStorage.save({
        text,
        prefix,
        title: formData.title,
        description: formData.description,
        language: formData.language
      })
      
      setPublishedUrl(result.url)
      
      trackEvent('qr_published', { 
        alias: result.id, 
        hasTitle: !!formData.title, 
        hasDescription: !!formData.description,
        language: formData.language 
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish')
      trackEvent('qr_publish_error', { error: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleCopyUrl = async () => {
    if (!publishedUrl) return
    
    try {
      await navigator.clipboard.writeText(publishedUrl)
      trackEvent('published_url_copied')
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  if (publishedUrl) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 flex flex-col h-screen w-screen" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Published Successfully</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-0">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Success!
          </h3>
          
          <p className="text-gray-600 mb-8 text-center max-w-md">
            Your QR code page has been published and is ready to share!
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-8 w-full max-w-md">
            <p className="text-sm text-gray-500 mb-2">Published URL:</p>
            <p className="text-sm font-mono text-gray-800 break-all">{publishedUrl}</p>
          </div>
          
          <div className="flex gap-3 w-full max-w-md">
            <button
              onClick={handleCopyUrl}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy URL
            </button>
            
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white z-50 flex flex-col h-screen w-screen" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-900">Publish QR Code</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto min-h-0">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter page title (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="fr">Français</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPublishing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Publish QR Code
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}












