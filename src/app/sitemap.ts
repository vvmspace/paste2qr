import { MetadataRoute } from 'next'
import { pageConfigs } from '../configs/pages'
import { supportedLocales, defaultLocale } from '../lib/locales'

export default function sitemap(): MetadataRoute.Sitemap {
  // Get environment variables safely
  const getSiteUrl = () => {
    try {
      return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    } catch {
      return 'http://localhost:3000'
    }
  }
  
  const baseUrl = getSiteUrl()
  const sitemap: MetadataRoute.Sitemap = []
  
  // Generate localized URLs for each page
  const pages = [
    { slug: 'home', path: '' },
    { slug: 'wifi-qr-code-generator', path: 'wifi-qr-code-generator' },
    { slug: 'phone-number-qr-code', path: 'phone-number-qr-code' },
    { slug: 'email-qr-code-generator', path: 'email-qr-code-generator' },
    { slug: 'sms-qr-code-maker', path: 'sms-qr-code-maker' },
  ]
  
  for (const page of pages) {
    for (const locale of supportedLocales) {
      const url = locale === defaultLocale 
        ? `${baseUrl}/${page.path}`.replace(/\/$/, '') || baseUrl
        : `${baseUrl}/${locale}/${page.path}`.replace(/\/$/, '') || `${baseUrl}/${locale}`
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.slug === 'home' ? 'daily' : 'weekly',
        priority: page.slug === 'home' ? 1.0 : 0.8,
      })
    }
  }

  return sitemap
}

