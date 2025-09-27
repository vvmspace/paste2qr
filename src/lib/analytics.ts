// Analytics utility functions
// This provides an abstraction layer for analytics events

interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

interface AnalyticsPageView {
  page_title: string
  page_location: string
  page_path: string
}

// Mock analytics implementation
class MockAnalytics {
  private events: AnalyticsEvent[] = []
  private pageViews: AnalyticsPageView[] = []

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    console.log('📊 Analytics Event:', event)
    this.events.push(event)
    
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      })
    }
  }

  // Track page views
  trackPageView(pageView: AnalyticsPageView) {
    console.log('📊 Analytics Page View:', pageView)
    this.pageViews.push(pageView)
    
    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-YSKXMZGQVF', {
        page_title: pageView.page_title,
        page_location: pageView.page_location,
        page_path: pageView.page_path
      })
    }
  }

  // Get tracked events (for debugging)
  getEvents() {
    return this.events
  }

  // Get tracked page views (for debugging)
  getPageViews() {
    return this.pageViews
  }

  // Clear all data (for testing)
  clear() {
    this.events = []
    this.pageViews = []
  }
}

// Create singleton instance
const analytics = new MockAnalytics()

// Export functions for easy use
export const trackEvent = (event: AnalyticsEvent) => analytics.trackEvent(event)
export const trackPageView = (pageView: AnalyticsPageView) => analytics.trackPageView(pageView)
export const getAnalyticsData = () => ({
  events: analytics.getEvents(),
  pageViews: analytics.getPageViews()
})
export const clearAnalytics = () => analytics.clear()

// Predefined event types for QR Code Generator
export const QR_EVENTS = {
  // QR Code Generation
  QR_GENERATED: (method: 'paste' | 'type' | 'upload') => ({
    action: 'qr_generated',
    category: 'QR_Generation',
    label: method
  }),
  
  QR_COPIED: () => ({
    action: 'qr_copied',
    category: 'QR_Actions',
    label: 'copy'
  }),
  
  QR_DOWNLOADED: (format: 'png' | 'svg' | 'pdf') => ({
    action: 'qr_downloaded',
    category: 'QR_Actions',
    label: format
  }),
  
  QR_SHARED: (method: 'link' | 'social' | 'email') => ({
    action: 'qr_shared',
    category: 'QR_Actions',
    label: method
  }),
  
  // Page Navigation
  PAGE_VIEW: (page: string) => ({
    action: 'page_view',
    category: 'Navigation',
    label: page
  }),
  
  MENU_OPENED: () => ({
    action: 'menu_opened',
    category: 'Navigation',
    label: 'hamburger_menu'
  }),
  
  LANGUAGE_CHANGED: (language: string) => ({
    action: 'language_changed',
    category: 'Settings',
    label: language
  }),
  
  THEME_CHANGED: (theme: 'light' | 'dark') => ({
    action: 'theme_changed',
    category: 'Settings',
    label: theme
  }),
  
  // QR Code Publishing
  QR_PUBLISHED: (type: 'contact' | 'wifi' | 'url' | 'text') => ({
    action: 'qr_published',
    category: 'Publishing',
    label: type
  }),
  
  // User Engagement
  PASTE_BUTTON_CLICKED: () => ({
    action: 'paste_button_clicked',
    category: 'User_Interaction',
    label: 'paste_button'
  }),
  
  GENERATE_BUTTON_CLICKED: () => ({
    action: 'generate_button_clicked',
    category: 'User_Interaction',
    label: 'generate_button'
  }),
  
  // Error Tracking
  ERROR_OCCURRED: (error: string) => ({
    action: 'error_occurred',
    category: 'Errors',
    label: error
  })
}

// Export the analytics instance for advanced usage
export default analytics