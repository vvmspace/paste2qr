import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { PWAInstallPrompt } from '../../components/PWAInstallPrompt'
import { isValidLocale, getDefaultLocale } from '../../lib/locales'

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
const getDefaultLocaleSafe = () => {
  try {
    return process.env.DEFAULT_LOCALE || 'en'
  } catch {
    return 'en'
  }
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  
  if (!isValidLocale(locale)) {
    return {
      title: 'Paste2QR - QR Code Generator',
      description: 'Generate QR codes instantly from any text.',
    }
  }

  const siteUrl = getEnvVar('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')
  
  return {
    title: 'Paste2QR - QR Code Generator',
    description: 'Generate QR codes instantly from any text. Fast, free, and easy to use QR code generator with publishing options.',
    keywords: 'paste to QR code, paste QR generator, clipboard to QR, instant QR code, text to QR, paste text QR',
    authors: [{ name: 'Paste2QR' }],
    creator: 'Paste2QR',
    publisher: 'Paste2QR',
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
    alternates: {
      canonical: locale === 'en' ? `${siteUrl}/` : `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/`,
        es: `${siteUrl}/es`,
        zh: `${siteUrl}/zh`,
        fr: `${siteUrl}/fr`,
        am: `${siteUrl}/am`,
        pt: `${siteUrl}/pt`,
      }
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 
              locale === 'es' ? 'es_ES' :
              locale === 'zh' ? 'zh_CN' :
              locale === 'fr' ? 'fr_FR' :
              locale === 'am' ? 'am_ET' :
              locale === 'pt' ? 'pt_PT' : 'en_US',
      url: `${siteUrl}/${locale}`,
      title: 'QR Code Generator - Create QR Codes Instantly',
      description: 'Generate QR codes instantly from any text. Fast, free, and easy to use QR code generator with publishing options.',
      siteName: 'Paste2QR',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'QR Code Generator - Create QR Codes Instantly',
      description: 'Generate QR codes instantly from any text. Fast, free, and easy to use QR code generator with publishing options.',
    },
  }
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params
  
  if (!isValidLocale(locale)) {
    // Redirect to default locale
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <PWAInstallPrompt />
    </div>
  )
}