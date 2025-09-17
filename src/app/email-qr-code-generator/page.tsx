import { UniversalPage } from '../../components/UniversalPage'
import { pageConfigs } from '../../configs/pages'

export const metadata = {
  title: pageConfigs['email-qr-code-generator'].title,
  description: pageConfigs['email-qr-code-generator'].description,
  keywords: pageConfigs['email-qr-code-generator'].keywords,
  alternates: {
    canonical: pageConfigs['email-qr-code-generator'].canonicalUrl,
  },
}

export default function EmailQRCodeGeneratorPage() {
  return <UniversalPage config={pageConfigs['email-qr-code-generator']} />
}




