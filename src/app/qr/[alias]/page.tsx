import { notFound } from 'next/navigation'
import { ServerUniversalPage } from '../../../components/ServerUniversalPage'
import { loadPageConfig } from '../../../lib/configLoader'

interface PublishedPageProps {
  params: {
    alias: string
  }
}

export default async function PublishedPage({ params }: PublishedPageProps) {
  const pageData = await loadPageConfig(params.alias)
  
  if (!pageData) {
    notFound()
  }
  
  return <ServerUniversalPage config={pageData.config} mdxSource={pageData.mdxSource} originalText={pageData.originalText} />
}

export async function generateMetadata({ params }: PublishedPageProps) {
  const pageData = await loadPageConfig(params.alias)
  
  if (!pageData) {
    return {
      title: 'QR Code Not Found',
      description: 'The requested QR code page could not be found.'
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







