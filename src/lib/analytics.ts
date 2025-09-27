// Analytics utility functions
// This provides an abstraction layer for analytics events

// Define a type for supported event names and their parameters
type AnalyticsEvent =
  | { name: 'qr_generated'; params: { type: 'paste' | 'manual' } }
  | { name: 'qr_copied'; params?: undefined }
  | { name: 'qr_downloaded'; params: { format: 'png' | 'svg' } }
  | { name: 'qr_shared'; params: { method: 'link' | 'image' } }
  | { name: 'menu_opened'; params?: undefined }
  | { name: 'language_changed'; params: { language: string } }
  | { name: 'theme_changed'; params: { theme: 'light' | 'dark' } }
  | { name: 'paste_button_clicked'; params?: undefined }
  | { name: 'generate_button_clicked'; params?: undefined }
  | { name: 'error_occurred'; params: { message: string } }
  | { name: 'page_view'; params: { page: string } }
  | { name: 'qr_published'; params: { type: string } }

// Abstracted event tracking function
export const trackEvent = (event: AnalyticsEvent['name'], params?: AnalyticsEvent['params']) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    // Use proper GA4 format with event parameters
    const eventParams: any = {
      event_category: 'QR_Generator',
      event_label: event,
      value: 1
    }
    
    // Add specific parameters based on event type
    if (params) {
      if ('type' in params) eventParams.type = params.type
      if ('format' in params) eventParams.format = params.format
      if ('method' in params) eventParams.method = params.method
      if ('language' in params) eventParams.language = params.language
      if ('theme' in params) eventParams.theme = params.theme
      if ('page' in params) eventParams.page = params.page
      if ('message' in params) eventParams.message = params.message
    }
    
    (window as any).gtag('event', event, eventParams)
  } else {
    // Fallback for environments where gtag is not available (e.g., during SSR or testing)
    console.log(`Analytics Event: ${event}`, params)
  }
}

// Centralized event names for consistency
export const QR_EVENTS = {
  QR_GENERATED: (type: 'paste' | 'manual') => ({ name: 'qr_generated', params: { type } }),
  QR_COPIED: () => ({ name: 'qr_copied' }),
  QR_DOWNLOADED: (format: 'png' | 'svg') => ({ name: 'qr_downloaded', params: { format } }),
  QR_SHARED: (method: 'link' | 'image') => ({ name: 'qr_shared', params: { method } }),
  MENU_OPENED: () => ({ name: 'menu_opened' }),
  LANGUAGE_CHANGED: (language: string) => ({ name: 'language_changed', params: { language } }),
  THEME_CHANGED: (theme: 'light' | 'dark') => ({ name: 'theme_changed', params: { theme } }),
  PASTE_BUTTON_CLICKED: () => ({ name: 'paste_button_clicked' }),
  GENERATE_BUTTON_CLICKED: () => ({ name: 'generate_button_clicked' }),
  ERROR_OCCURRED: (message: string) => ({ name: 'error_occurred', params: { message } }),
}