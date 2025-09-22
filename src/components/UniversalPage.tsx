'use client'

import { Navigation } from './Navigation'
import { QRGenerator } from './QRGenerator'
import { HeroContent } from './HeroContent'
import { ServerMDXContent } from './ServerMDXContent'
import { PageConfig } from '../configs/pages'

interface UniversalPageProps {
  config: PageConfig
  mdxSource?: string
  locale?: string
}

export function UniversalPage({ config, mdxSource, locale }: UniversalPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 pb-24" style={{ contain: 'layout style paint' }}>
      <Navigation locale={locale} />
      <div className="pt-16">
        <QRGenerator pageConfig={config} />
        <HeroContent />
        
        {/* SEO Content - hidden below the fold */}
        <div className="px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <ServerMDXContent config={config} mdxSource={mdxSource} />
          </div>
        </div>
      </div>
    </main>
  )
}






