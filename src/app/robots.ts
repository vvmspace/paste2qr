import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Get environment variables safely
  const getSiteUrl = () => {
    try {
      return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    } catch {
      return 'http://localhost:3000'
    }
  }
  
  const baseUrl = getSiteUrl()
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
