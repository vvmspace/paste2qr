import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// import { Providers } from '../components/Providers'
// import { Analytics } from '../components/Analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: process.env.SITE_TITLE_EN || 'QR Code Generator',
  description: process.env.SITE_DESCRIPTION_EN || 'Generate QR codes instantly from any text',
  keywords: 'QR code, generator, create, instant, free, text to QR',
  authors: [{ name: 'Paste2QR' }],
  creator: 'Paste2QR',
  publisher: 'Paste2QR',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: process.env.SITE_TITLE_EN || 'QR Code Generator',
    description: process.env.SITE_DESCRIPTION_EN || 'Generate QR codes instantly from any text',
    type: 'website',
    locale: process.env.DEFAULT_LOCALE === 'en' ? 'en_US' : 
            process.env.DEFAULT_LOCALE === 'es' ? 'es_ES' :
            process.env.DEFAULT_LOCALE === 'zh' ? 'zh_CN' :
            process.env.DEFAULT_LOCALE === 'fr' ? 'fr_FR' : 'en_US',
    siteName: 'Paste2QR',
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.SITE_TITLE_EN || 'QR Code Generator',
    description: process.env.SITE_DESCRIPTION_EN || 'Generate QR codes instantly from any text',
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
    <html lang={process.env.DEFAULT_LOCALE || 'en'} suppressHydrationWarning>
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
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}












