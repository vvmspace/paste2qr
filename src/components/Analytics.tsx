'use client'

import Script from 'next/script'
import { useEffect } from 'react'

interface AnalyticsProps {
  trackingId?: string
}

export function Analytics({ trackingId }: AnalyticsProps) {
  useEffect(() => {
    if (!trackingId || typeof window === 'undefined') return

    // Initialize dataLayer first
    window.dataLayer = window.dataLayer || []
    
    // Define gtag function
    window.gtag = window.gtag || function(...args: any[]) {
      window.dataLayer.push(args)
    }
  }, [trackingId])

  if (!trackingId) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}