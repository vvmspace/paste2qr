import { UniversalPage } from '../../components/UniversalPage'
import { pageConfigs } from '../../configs/pages'

export const metadata = {
  title: pageConfigs['sms-qr-code-maker'].title,
  description: pageConfigs['sms-qr-code-maker'].description,
  keywords: pageConfigs['sms-qr-code-maker'].keywords,
  alternates: {
    canonical: pageConfigs['sms-qr-code-maker'].canonicalUrl,
  },
}

export default function SMSQRCodeMakerPage() {
  return <UniversalPage config={pageConfigs['sms-qr-code-maker']} locale="en" />
}




