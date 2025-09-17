// Locale configuration and utilities

export const supportedLocales = ['en', 'es', 'zh', 'fr', 'am'] as const
export type SupportedLocale = typeof supportedLocales[number]

export const defaultLocale: SupportedLocale = 'en'

export const locales = supportedLocales
export const isValidLocale = (locale: string): locale is SupportedLocale => {
  return supportedLocales.includes(locale as SupportedLocale)
}

export const localeNames = {
  en: 'English',
  es: 'Español', 
  zh: '中文',
  fr: 'Français',
  am: 'አማርኛ'
} as const

export const localeFlags = {
  en: '🇺🇸',
  es: '🇪🇸',
  zh: '🇨🇳', 
  fr: '🇫🇷',
  am: '🇪🇹'
} as const

export function getLocaleFromPathname(pathname: string): SupportedLocale {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  
  if (isValidLocale(firstSegment)) {
    return firstSegment
  }
  
  return defaultLocale
}

export function getLocalizedPathname(pathname: string, locale: SupportedLocale): string {
  const segments = pathname.split('/').filter(Boolean)
  const currentLocale = getLocaleFromPathname(pathname)
  
  // Remove current locale if present
  if (isValidLocale(segments[0])) {
    segments.shift()
  }
  
  // Add new locale
  if (locale !== defaultLocale) {
    segments.unshift(locale)
  }
  
  return '/' + segments.join('/')
}

export function getCanonicalPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const currentLocale = getLocaleFromPathname(pathname)
  
  // Remove locale from path for canonical URL
  if (isValidLocale(segments[0])) {
    segments.shift()
  }
  
  return '/' + segments.join('/')
}

export function getDefaultLocale(): SupportedLocale {
  try {
    return (process.env.DEFAULT_LOCALE as SupportedLocale) || defaultLocale
  } catch {
    return defaultLocale
  }
}
