'use client'

import Head from 'next/head'
import { useTranslation } from 'react-i18next'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  canonicalUrl?: string
  ogImage?: string
  structuredData?: any
  locale?: string
}

export function SEOHead({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  structuredData,
  locale
}: SEOHeadProps) {
  const { i18n } = useTranslation()
  const currentLocale = locale || i18n.language || 'en'
  
  // Get environment variables safely
  const getSiteUrl = () => {
    try {
      return process.env.NEXT_PUBLIC_SITE_URL || 'https://paste2qr.com'
    } catch {
      return 'https://paste2qr.com'
    }
  }
  
  const siteUrl = getSiteUrl()
  const fullCanonicalUrl = canonicalUrl || siteUrl
  const fullOgImage = ogImage || `${siteUrl}/og-image.png`
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Paste2QR" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={currentLocale} />
      <meta name="language" content={currentLocale} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="Paste2QR" />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={currentLocale === 'en' ? 'en_US' : 
                                          currentLocale === 'es' ? 'es_ES' :
                                          currentLocale === 'zh' ? 'zh_CN' :
                                          currentLocale === 'fr' ? 'fr_FR' :
                                          currentLocale === 'am' ? 'am_ET' : 'en_US'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="application-name" content="Paste2QR" />
      <meta name="apple-mobile-web-app-title" content="Paste2QR" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="msapplication-navbutton-color" content="#3b82f6" />
      
      {/* Performance and Security */}
      <meta name="format-detection" content="telephone=no, address=no, email=no" />
      <meta name="referrer" content="origin-when-cross-origin" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Head>
  )
}
