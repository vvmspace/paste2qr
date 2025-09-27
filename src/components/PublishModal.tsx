'use client'

import { useState } from 'react'
import { trackEvent, QR_EVENTS } from '../lib/analytics'
import { useTranslation } from 'react-i18next'

interface PublishModalProps {
  qrCodeDataUrl: string | null
  text: string
  prefix: string
  onClose: () => void
}

export function PublishModal({ qrCodeDataUrl, text, prefix, onClose }: PublishModalProps) {
  const { t } = useTranslation()
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
      
      trackEvent('qr_published', { type: 'text' })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('publish.failed'))
      trackEvent('error_occurred', { message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleCopyUrl = async () => {
    if (!publishedUrl) return
    
    try {
      await navigator.clipboard.writeText(publishedUrl)
      trackEvent('qr_copied')
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  if (publishedUrl) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-white dark:bg-slate-900 z-50 flex flex-col h-screen w-screen" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-slate-700/50 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{t('publish.successHeader')}</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 active:bg-gray-200/80 dark:active:bg-gray-700/80 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-0">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center tracking-tight">
            {t('publish.successTitle')}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md leading-relaxed">
            {t('publish.successText')}
          </p>
          
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-8 w-full max-w-md border border-gray-200/50 dark:border-slate-700/50">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">{t('publish.publishedUrl')}</p>
            <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">{publishedUrl}</p>
          </div>
          
          <div className="flex gap-3 w-full max-w-md">
            <button
              onClick={handleCopyUrl}
              className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {t('publish.copyUrl')}
            </button>
            
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              {t('publish.close')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-white dark:bg-slate-900 z-50 flex flex-col h-screen w-screen" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-slate-700/50 flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{t('publish.title')}</h2>
        <button
          onClick={onClose}
          className="p-2 -mr-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 active:bg-gray-200/80 dark:active:bg-gray-700/80 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto min-h-0">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('publish.pageTitle')}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={t('publish.pageTitlePlaceholder')}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-colors text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('publish.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('publish.descriptionPlaceholder')}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-colors resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('publish.language')}
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-colors text-gray-900 dark:text-gray-100"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文</option>
              <option value="fr">Français</option>
              <option value="am">አማርኛ</option>
              <option value="pt">Português</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPublishing}
              className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] disabled:scale-100"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('publish.publishing')}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {t('publish.publishQR')}
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 shadow-sm active:scale-[0.98]"
            >
              {t('publish.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}












