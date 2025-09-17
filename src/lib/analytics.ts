// Mock analytics function for tracking events
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // Mock implementation - can be replaced with real analytics service
  if (typeof window !== 'undefined') {
    console.log('Analytics Event:', eventName, properties)
    
    // Mock sending to analytics service
    // In real implementation, this would send to Google Analytics, Mixpanel, etc.
    try {
      // Example: gtag('event', eventName, properties)
      // Example: mixpanel.track(eventName, properties)
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }
}

// Key business metrics to track
export const METRICS = {
  QR_GENERATED: 'qr_generated',
  QR_DOWNLOADED: 'qr_downloaded',
  QR_SHARED: 'qr_shared',
  TEXT_PASTED: 'text_pasted',
  PAGE_VIEWED: 'page_viewed',
  PUBLISH_CLICKED: 'publish_clicked',
  LANGUAGE_CHANGED: 'language_changed',
  ERROR_OCCURRED: 'error_occurred',
} as const

// Track page views
export function trackPageView(pageName: string, properties?: Record<string, any>) {
  trackEvent(METRICS.PAGE_VIEWED, {
    page: pageName,
    ...properties
  })
}

// Track QR code generation
export function trackQRGenerated(properties?: Record<string, any>) {
  trackEvent(METRICS.QR_GENERATED, properties)
}

// Track QR code download
export function trackQRDownloaded(properties?: Record<string, any>) {
  trackEvent(METRICS.QR_DOWNLOADED, properties)
}

// Track QR code sharing
export function trackQRShared(properties?: Record<string, any>) {
  trackEvent(METRICS.QR_SHARED, properties)
}

// Track text pasting
export function trackTextPasted(properties?: Record<string, any>) {
  trackEvent(METRICS.TEXT_PASTED, properties)
}

// Track publish button clicks
export function trackPublishClicked(properties?: Record<string, any>) {
  trackEvent(METRICS.PUBLISH_CLICKED, properties)
}

// Track language changes
export function trackLanguageChanged(properties?: Record<string, any>) {
  trackEvent(METRICS.LANGUAGE_CHANGED, properties)
}

// Track errors
export function trackError(error: Error | string, properties?: Record<string, any>) {
  trackEvent(METRICS.ERROR_OCCURRED, {
    error: typeof error === 'string' ? error : error.message,
    stack: typeof error === 'object' ? error.stack : undefined,
    ...properties
  })
}
