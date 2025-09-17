import { notFound } from 'next/navigation'
import { supportedLocales, defaultLocale } from '../../lib/locales'
import { ServerUniversalPage } from '../../components/ServerUniversalPage'
import { pageConfigs } from '../../configs/pages'

interface PageProps {
  params: {
    locale: string
  }
}

export async function generateStaticParams() {
  return supportedLocales.map((locale) => ({
    locale: locale,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = params
  
  if (!supportedLocales.includes(locale as any)) {
    notFound()
  }
  
  const config = pageConfigs.home
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: locale === defaultLocale ? config.canonicalUrl : `${config.canonicalUrl}/${locale}`,
    },
  }
}

export default async function LocalizedHomePage({ params }: PageProps) {
  const { locale } = params
  
  if (!supportedLocales.includes(locale as any)) {
    notFound()
  }
  
  return <ServerUniversalPage config={pageConfigs.home} />
}