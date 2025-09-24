import { notFound } from 'next/navigation'
import { UniversalPage } from '../../components/UniversalPage'
import { loadPageConfig } from '../../lib/configLoader'

export async function generateMetadata() {
  const result = await loadPageConfig('contact-info-qr-code')
  if (!result) {
    notFound()
  }
  
  const { config } = result
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: config.canonicalUrl,
    },
  }
}

export default async function ContactInfoQRCodePage() {
  const result = await loadPageConfig('contact-info-qr-code')
  if (!result) {
    notFound()
  }
  
  const { config, mdxSource } = result
  
  return (
    <UniversalPage 
      config={config} 
      mdxSource={mdxSource}
    />
  )
}
