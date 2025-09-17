import { redirect } from 'next/navigation'
import { isValidLocale, defaultLocale } from '../../lib/locales'
import { UniversalPage } from '../../components/UniversalPage'

export default function LocaleIndexPage({ params }: { params: { locale: string } }) {
	const { locale } = params
	if (!isValidLocale(locale)) {
		return null
	}
	if (locale === defaultLocale) {
		redirect('/')
	}
	
	// For non-default locales, show the localized content
	const config = {
		title: `Paste to QR Code - ${locale.toUpperCase()}`,
		description: `Paste any text and get a QR code instantly. The fastest and simplest way to create QR codes from clipboard content. Free and easy to use.`,
		keywords: 'paste to QR code, paste QR generator, clipboard to QR, instant QR code, text to QR, paste text QR',
		heroTitle: 'Paste to QR Code',
		heroSubtitle: 'Paste any text from your clipboard and get a QR code instantly. No typing, no complexity - just paste and generate.',
		heroButtonText: 'Paste & Generate',
		heroGradient: 'from-blue-600 to-blue-800',
		canonicalUrl: `http://localhost:3000/${locale}`
	}
	
	return <UniversalPage config={config} />
}