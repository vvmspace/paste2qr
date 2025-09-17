import { UniversalPage } from '../../components/UniversalPage'
import { pageConfigs } from '../../configs/pages'

export const metadata = {
  title: pageConfigs['phone-number-qr-code'].title,
  description: pageConfigs['phone-number-qr-code'].description,
  keywords: pageConfigs['phone-number-qr-code'].keywords,
  alternates: {
    canonical: pageConfigs['phone-number-qr-code'].canonicalUrl,
  },
}

export default function PhoneNumberQRCodePage() {
  return <UniversalPage config={pageConfigs['phone-number-qr-code']} />
}




