'use client'

import { useEffect } from 'react'

interface AnalyticsProps {
  trackingId?: string
}

export function Analytics({ trackingId }: AnalyticsProps) {
  useEffect(() => {
    if (!trackingId || typeof window === 'undefined') return

    // Load Google Analytics script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    window.gtag = gtag

    gtag('js', new Date())
    gtag('config', trackingId)

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector(`script[src*="${trackingId}"]`)
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [trackingId])

  return null
}

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}