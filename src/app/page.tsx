import { UniversalPage } from '../components/UniversalPage'
import { getLocalizedSEO } from '../lib/seo'
import { generateStructuredData } from '../lib/seo'
import { getLocalizedMDXContent } from '../lib/mdxLoader'

export async function generateMetadata() {
  const seo = getLocalizedSEO('home', 'en')
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
      languages: seo.alternateUrls
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.canonicalUrl,
      siteName: 'Paste2QR',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
    other: {
      'application-name': 'Paste2QR',
      'apple-mobile-web-app-title': 'Paste2QR',
      'msapplication-TileColor': '#3b82f6',
      'theme-color': '#3b82f6',
    }
  }
}

export default async function HomePage() {
  const seo = getLocalizedSEO('home', 'en')
  const structuredData = generateStructuredData('home', 'en', seo.canonicalUrl)
  const mdxSource = await getLocalizedMDXContent('home', 'en')
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <UniversalPage config={{
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        canonicalUrl: seo.canonicalUrl,
        heroTitle: seo.title,
        heroSubtitle: seo.description,
        heroButtonText: 'Paste & Generate',
        heroGradient: 'from-blue-600 to-blue-800',
      }} mdxSource={mdxSource || undefined} locale="en" />
    </>
  )
}










