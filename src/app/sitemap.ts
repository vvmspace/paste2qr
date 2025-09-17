import { MetadataRoute } from 'next'
import { pageConfigs } from '../configs/pages'

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
  
  // Static pages from pageConfigs
  const staticPages = Object.keys(pageConfigs).map((slug) => ({
    url: `${baseUrl}/${slug === 'home' ? '' : slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: slug === 'home' ? 1.0 : 0.8,
  }))

  // Additional SEO pages focused on "paste to QR"
  const seoPages = [
    {
      url: `${baseUrl}/wifi-qr-code-generator`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/phone-number-qr-code`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/email-qr-code-generator`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sms-qr-code-maker`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact-info-qr-code`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...staticPages,
    ...seoPages,
  ]
}

