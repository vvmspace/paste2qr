import { MetadataRoute } from 'next'
import { supportedLocales, defaultLocale } from '../lib/locales'
import { getAllMDXPages } from '../lib/mdxLoader'

export default function sitemap(): MetadataRoute.Sitemap {
  // Get environment variables safely
  const getSiteUrl = () => {
    try {
      return process.env.NEXT_PUBLIC_SITE_URL || 'https://paste2qr.com'
    } catch {
      return 'https://paste2qr.com'
    }
  }
  
  const baseUrl = getSiteUrl()
  const sitemap: MetadataRoute.Sitemap = []
  const mdxPages = getAllMDXPages()
  
  // Generate localized URLs for each page
  const pages = [
    { slug: 'home', path: '' },
    ...mdxPages.map(slug => ({ slug, path: slug }))
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
        alternates: {
          languages: {
            en: baseUrl + (page.path ? `/${page.path}` : ''),
            es: `${baseUrl}/es${page.path ? `/${page.path}` : ''}`,
            zh: `${baseUrl}/zh${page.path ? `/${page.path}` : ''}`,
            fr: `${baseUrl}/fr${page.path ? `/${page.path}` : ''}`,
            am: `${baseUrl}/am${page.path ? `/${page.path}` : ''}`,
          }
        }
      })
    }
  }

  return sitemap
}

