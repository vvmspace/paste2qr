'use client'

import { QRGenerator } from './QRGenerator'
import { Hero } from './Hero'
import { HeroContent } from './HeroContent'
import { ServerMDXContent } from './ServerMDXContent'
import { PageConfig } from '../configs/pages'

interface UniversalPageProps {
  config: PageConfig
  mdxSource?: string
}

export function UniversalPage({ config, mdxSource }: UniversalPageProps) {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <Hero />
      <QRGenerator />
      <HeroContent />
      
      {/* SEO Content - hidden below the fold */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <ServerMDXContent config={config} mdxSource={mdxSource} />
        </div>
      </div>
    </main>
  )
}






