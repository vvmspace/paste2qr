import { UniversalPage } from '../../components/UniversalPage'
import { pageConfigs } from '../../configs/pages'

export const metadata = {
  title: pageConfigs['wifi-qr-code-generator'].title,
  description: pageConfigs['wifi-qr-code-generator'].description,
  keywords: pageConfigs['wifi-qr-code-generator'].keywords,
  alternates: {
    canonical: pageConfigs['wifi-qr-code-generator'].canonicalUrl,
  },
}

export default function WiFiQRGeneratorPage() {
  return <UniversalPage config={pageConfigs['wifi-qr-code-generator']} />
}




