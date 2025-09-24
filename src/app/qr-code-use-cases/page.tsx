import { UniversalPage } from '../../components/UniversalPage'
import { loadPageConfig } from '../../lib/configLoader'

export async function generateMetadata() {
  const result = await loadPageConfig('qr-code-use-cases', 'en')
  if (!result) {
    return {
      title: 'QR Code Use Cases - Paste2QR',
      description: 'Explore real-world applications and use cases for QR codes across industries.',
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

export default async function QRCodeUseCasesPage() {
  const result = await loadPageConfig('qr-code-use-cases', 'en')
  if (!result) {
    return <div>Page not found</div>
  }
  
  const { config, mdxSource } = result
  return <UniversalPage config={config} mdxSource={mdxSource} locale="en" />
}
