import { QRGenerator } from './QRGenerator'
import { Hero } from './Hero'
import { ServerMDXContent } from './ServerMDXContent'
import { PageConfig } from '../configs/pages'
import { type SupportedLocale } from '../lib/locales'

interface ServerUniversalPageProps {
  config: PageConfig
  mdxSource?: string
  originalText?: string
  locale?: SupportedLocale
}

export function ServerUniversalPage({ config, mdxSource, originalText, locale }: ServerUniversalPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <Hero title={config.heroTitle} />
      <QRGenerator originalText={originalText} />
      
      {/* SEO Content - hidden below the fold */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <ServerMDXContent config={config} mdxSource={mdxSource} />
        </div>
      </div>
    </main>
  )
}



