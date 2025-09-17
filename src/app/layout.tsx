import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PWAInstallPrompt } from '../components/PWAInstallPrompt'
import { Providers } from '../components/Providers'
import { supportedLocales, defaultLocale, getLocaleFromPathname } from '../lib/locales'
// import { Providers } from '../components/Providers'
// import { Analytics } from '../components/Analytics'

const inter = Inter({ subsets: ['latin'] })

// Get environment variables safely
const getEnvVar = (key: string, defaultValue: string) => {
  try {
    return process.env[key] || defaultValue
  } catch {
    return defaultValue
  }
}

// Get default locale safely
const getDefaultLocale = () => {
  try {
    return process.env.DEFAULT_LOCALE || 'en'
  } catch {
    return 'en'
  }
}

// Generate alternate links for hreflang (path-based locales)
const generateAlternateLinks = () => {
  const baseUrl = getEnvVar('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
  const locales = ['en', 'es', 'zh', 'fr', 'am', 'pt']
  
  return locales.map(locale => ({
    rel: 'alternate',
    hreflang: locale,
    href: locale === 'en' ? `${baseUrl}/` : `${baseUrl}/${locale}`
  }))
}

export const metadata: Metadata = {
  title: getEnvVar('SITE_TITLE_EN', 'QR Code Generator'),
  description: getEnvVar('SITE_DESCRIPTION_EN', 'Generate QR codes instantly from any text'),
  keywords: 'QR code, generator, create, instant, free, text to QR',
  authors: [{ name: 'Paste2QR' }],
  creator: 'Paste2QR',
  publisher: 'Paste2QR',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(getEnvVar('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')),
  openGraph: {
    title: getEnvVar('SITE_TITLE_EN', 'QR Code Generator'),
    description: getEnvVar('SITE_DESCRIPTION_EN', 'Generate QR codes instantly from any text'),
    type: 'website',
    locale: getDefaultLocale() === 'en' ? 'en_US' : 
            getDefaultLocale() === 'es' ? 'es_ES' :
            getDefaultLocale() === 'zh' ? 'zh_CN' :
            getDefaultLocale() === 'fr' ? 'fr_FR' : 'en_US',
    siteName: 'Paste2QR',
  },
  twitter: {
    card: 'summary_large_image',
    title: getEnvVar('SITE_TITLE_EN', 'QR Code Generator'),
    description: getEnvVar('SITE_DESCRIPTION_EN', 'Generate QR codes instantly from any text'),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#3b82f6',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Paste2QR" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-navbutton-color" content="#3b82f6" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Paste2QR" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Paste2QR" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        {generateAlternateLinks().map((link, index) => (
          <link key={index} rel={link.rel} hrefLang={link.hreflang} href={link.href} />
        ))}
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          <Providers>
            {children}
            <PWAInstallPrompt />
          </Providers>
        </div>
      </body>
    </html>
  )
}





















