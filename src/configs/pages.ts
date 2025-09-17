export interface PageConfig {
  title: string
  description: string
  keywords: string
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  heroGradient: string
  // SEO and content properties
  canonicalUrl?: string
  ogImage?: string
  twitterCard?: string
  // Content sections
  features?: Array<{
    title: string
    description: string
    icon?: string
  }>
  faq?: Array<{
    question: string
    answer: string
  }>
  // Custom content
  customContent?: string
  // QR code specific
  qrPrefix?: string
  defaultText?: string
  // Analytics
  trackingId?: string
}

export const pageConfigs: Record<string, PageConfig> = {
  home: {
    title: 'Paste to QR Code - Instant QR Code Generator',
    description: 'Paste any text and get a QR code instantly. The fastest and simplest way to create QR codes from clipboard content. Free and easy to use.',
    keywords: 'paste to QR code, paste QR generator, clipboard to QR, instant QR code, text to QR, paste text QR',
    heroTitle: 'Paste to QR Code',
    heroSubtitle: 'Paste any text from your clipboard and get a QR code instantly. No typing, no complexity - just paste and generate.',
    heroButtonText: 'Paste & Generate',
    heroGradient: 'from-blue-600 to-blue-800',
    canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
  'wifi-qr-code-generator': {
    title: 'Paste WiFi Password to QR Code - Instant WiFi QR Generator',
    description: 'Paste your WiFi password and create a QR code instantly. Share your WiFi network with guests using scannable QR codes. Free and easy to use.',
    keywords: 'paste wifi password to QR, wifi QR code, paste wifi QR generator, clipboard wifi QR, instant wifi QR',
    heroTitle: 'Paste WiFi to QR',
    heroSubtitle: 'Paste your WiFi password and get a QR code instantly. Share your network with guests in seconds.',
    heroButtonText: 'Paste WiFi & Generate',
    heroGradient: 'from-green-600 to-green-800',
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/wifi-qr-code-generator`,
  },
  'phone-number-qr-code': {
    title: 'Paste Phone Number to QR Code - Instant Call QR Generator',
    description: 'Paste your phone number and create a QR code instantly. Allow people to call you with a simple scan. Free and easy to use.',
    keywords: 'paste phone number to QR, phone QR code, paste phone QR generator, clipboard phone QR, instant call QR',
    heroTitle: 'Paste Phone to QR',
    heroSubtitle: 'Paste your phone number and get a QR code instantly. Let people call you with a simple scan.',
    heroButtonText: 'Paste Phone & Generate',
    heroGradient: 'from-purple-600 to-purple-800',
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/phone-number-qr-code`,
  },
  'email-qr-code-generator': {
    title: 'Paste Email to QR Code - Instant Email QR Generator',
    description: 'Paste your email address and create a QR code instantly. Allow people to email you with a simple scan. Free and easy to use.',
    keywords: 'paste email to QR, email QR code, paste email QR generator, clipboard email QR, instant email QR',
    heroTitle: 'Paste Email to QR',
    heroSubtitle: 'Paste your email address and get a QR code instantly. Let people email you with a simple scan.',
    heroButtonText: 'Paste Email & Generate',
    heroGradient: 'from-red-600 to-red-800',
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/email-qr-code-generator`,
  },
  'sms-qr-code-maker': {
    title: 'Paste SMS to QR Code - Instant Text QR Generator',
    description: 'Paste your phone number and message to create a QR code instantly. Allow people to text you with a simple scan. Free and easy to use.',
    keywords: 'paste SMS to QR, SMS QR code, paste text QR generator, clipboard SMS QR, instant text QR',
    heroTitle: 'Paste SMS to QR',
    heroSubtitle: 'Paste your phone number and message to get a QR code instantly. Let people text you with a simple scan.',
    heroButtonText: 'Paste SMS & Generate',
    heroGradient: 'from-orange-600 to-orange-800',
    canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sms-qr-code-maker`,
  },
}








