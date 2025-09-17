import { UniversalPage } from '../../components/UniversalPage'
import { pageConfigs } from '../../configs/pages'

export const metadata = {
  title: pageConfigs['contact-info-qr-code'].title,
  description: pageConfigs['contact-info-qr-code'].description,
  keywords: pageConfigs['contact-info-qr-code'].keywords,
}

export default function ContactInfoQRCodePage() {
  return <UniversalPage config={pageConfigs['contact-info-qr-code']} />
}
