'use client'

import { usePageView } from '../hooks/usePageView'

interface PageViewTrackerProps {
  trackingId?: string
}

export function PageViewTracker({ trackingId }: PageViewTrackerProps) {
  usePageView(trackingId)
  return null
}
