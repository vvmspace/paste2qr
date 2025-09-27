'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function usePageView(trackingId?: string) {
  const pathname = usePathname()

  useEffect(() => {
    if (!trackingId || typeof window === 'undefined' || !window.gtag) return

    // Track page view
    window.gtag('config', trackingId, {
      page_path: pathname,
    })
  }, [pathname, trackingId])
}
