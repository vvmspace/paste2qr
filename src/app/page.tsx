import { UniversalPage } from '../components/UniversalPage'
import { pageConfigs } from '../configs/pages'

export const metadata = {
  title: pageConfigs.home.title,
  description: pageConfigs.home.description,
  keywords: pageConfigs.home.keywords,
  alternates: {
    canonical: pageConfigs.home.canonicalUrl,
  },
}

export default function HomePage() {
  return <UniversalPage config={pageConfigs.home} />
}










