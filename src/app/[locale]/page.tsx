import { redirect } from 'next/navigation'
import { isValidLocale, defaultLocale } from '../../lib/locales'
import { UniversalPage } from '../../components/UniversalPage'
import { getLocalizedSEO } from '../../lib/seo'
import { generateStructuredData } from '../../lib/seo'
import { getLocalizedMDXContent } from '../../lib/mdxLoader'

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params
  
  if (!isValidLocale(locale) || locale === defaultLocale) {
    return {}
  }
  
  const seo = getLocalizedSEO('home', locale)
  
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
      locale: locale === 'en' ? 'en_US' : 
              locale === 'es' ? 'es_ES' :
              locale === 'zh' ? 'zh_CN' :
              locale === 'fr' ? 'fr_FR' :
              locale === 'am' ? 'am_ET' : 'en_US',
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

export default async function LocaleIndexPage({ params }: { params: { locale: string } }) {
	const { locale } = params
	if (!isValidLocale(locale)) {
		return null
	}
	if (locale === defaultLocale) {
		redirect('/')
	}
	
	const seo = getLocalizedSEO('home', locale)
	const structuredData = generateStructuredData('home', locale, seo.canonicalUrl)
	const mdxSource = await getLocalizedMDXContent('home', locale)
	
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
			}} mdxSource={mdxSource || undefined} />
		</>
	)
}