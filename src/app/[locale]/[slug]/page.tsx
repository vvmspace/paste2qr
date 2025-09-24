import { notFound, redirect } from 'next/navigation'
import { supportedLocales, defaultLocale } from '../../../lib/locales'
import { ServerUniversalPage } from '../../../components/ServerUniversalPage'
import { loadPageConfig } from '../../../lib/configLoader'

interface PageProps {
  params: {
    locale: string
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = [
    'wifi-qr-code-generator',
    'phone-number-qr-code', 
    'email-qr-code-generator',
    'sms-qr-code-maker',
    'contact-info-qr-code',
    'qr-code-facts',
    'qr-code-use-cases'
  ]
  
  const params: Array<{ locale: string; slug: string }> = []
  for (const locale of supportedLocales) {
    for (const slug of slugs) {
      params.push({ locale, slug })
    }
  }
  
  return params
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = params
  
  if (!supportedLocales.includes(locale as any)) {
    notFound()
  }
  
  const result = await loadPageConfig(slug, locale)
  if (!result) {
    notFound()
  }
  
  const { config } = result
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: locale === defaultLocale 
        ? config.canonicalUrl 
        : config.canonicalUrl?.replace('/' + slug, `/${locale}/${slug}`),
    },
  }
}

export default async function LocalizedSlugPage({ params }: PageProps) {
  const { locale, slug } = params
  
  if (!supportedLocales.includes(locale as any)) {
    notFound()
  }
  if (locale === defaultLocale) {
    redirect(`/${slug}`)
  }
  
  const result = await loadPageConfig(slug, locale)
  if (!result) {
    notFound()
  }
  
  const { config, mdxSource, originalText } = result
  
  return (
    <ServerUniversalPage 
      config={config} 
      mdxSource={mdxSource}
      originalText={originalText}
    />
  )
}
