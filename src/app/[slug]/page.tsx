import { notFound } from 'next/navigation'
import { ServerUniversalPage } from '../../components/ServerUniversalPage'
import { loadPageConfig } from '../../lib/configLoader'

interface DynamicPageProps {
  params: {
    slug: string
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const pageData = await loadPageConfig(params.slug)

  if (!pageData) {
    notFound()
  }

  return <ServerUniversalPage config={pageData.config} mdxSource={pageData.mdxSource} />
}

export async function generateMetadata({ params }: DynamicPageProps) {
  const pageData = await loadPageConfig(params.slug)

  if (!pageData) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    }
  }

  const { config } = pageData

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: config.canonicalUrl,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      type: 'website',
      images: config.ogImage ? [{ url: config.ogImage }] : undefined,
    },
    twitter: {
      card: config.twitterCard || 'summary_large_image',
      title: config.title,
      description: config.description,
    },
  }
}










