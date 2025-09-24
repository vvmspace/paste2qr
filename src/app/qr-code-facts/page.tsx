import { UniversalPage } from '../../components/UniversalPage'
import { loadPageConfig } from '../../lib/configLoader'

export async function generateMetadata() {
  const result = await loadPageConfig('qr-code-facts', 'en')
  if (!result) {
    return {
      title: 'QR Code Facts - Paste2QR',
      description: 'Discover amazing facts about QR codes, their history, and global impact.',
    }
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

export default async function QRCodeFactsPage() {
  const result = await loadPageConfig('qr-code-facts', 'en')
  if (!result) {
    return <div>Page not found</div>
  }
  
  const { config, mdxSource } = result
  return <UniversalPage config={config} mdxSource={mdxSource} locale="en" />
}
