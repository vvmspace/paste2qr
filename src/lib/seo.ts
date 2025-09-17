// SEO utilities and localized metadata generation

export interface LocalizedSEO {
  title: string
  description: string
  keywords: string
  ogTitle?: string
  ogDescription?: string
  twitterTitle?: string
  twitterDescription?: string
  canonicalUrl: string
  alternateUrls: Record<string, string>
  structuredData?: any
}

export interface PageSEOConfig {
  en: LocalizedSEO
  es: LocalizedSEO
  zh: LocalizedSEO
  fr: LocalizedSEO
  am: LocalizedSEO
  pt: LocalizedSEO
}

// Get environment variables safely
const getSiteUrl = () => {
  try {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  } catch {
    return 'http://localhost:3000'
  }
}

// SEO configurations for different page types
export const seoConfigs: Record<string, PageSEOConfig> = {
  home: {
    en: {
      title: 'Paste to QR Code - Instant QR Code Generator | Free & Easy',
      description: 'Generate QR codes instantly from any text. Paste from clipboard and get QR code in seconds. Free, fast, and easy to use QR code generator with publishing options.',
      keywords: 'paste to QR code, paste QR generator, clipboard to QR, instant QR code, text to QR, paste text QR, free QR generator, online QR maker',
      canonicalUrl: getSiteUrl(),
      alternateUrls: {
        en: getSiteUrl(),
        es: `${getSiteUrl()}/es`,
        zh: `${getSiteUrl()}/zh`,
        fr: `${getSiteUrl()}/fr`,
        am: `${getSiteUrl()}/am`,
        pt: `${getSiteUrl()}/pt`
      }
    },
    es: {
      title: 'Pegar a Código QR - Generador Instantáneo | Gratis y Fácil',
      description: 'Genera códigos QR al instante desde cualquier texto. Pega desde el portapapeles y obtén código QR en segundos. Generador gratuito, rápido y fácil de usar.',
      keywords: 'pegar a código QR, generador QR pegar, portapapeles a QR, código QR instantáneo, texto a QR, pegar texto QR, generador QR gratis',
      canonicalUrl: `${getSiteUrl()}/es`,
      alternateUrls: {
        en: getSiteUrl(),
        es: `${getSiteUrl()}/es`,
        zh: `${getSiteUrl()}/zh`,
        fr: `${getSiteUrl()}/fr`,
        am: `${getSiteUrl()}/am`,
        pt: `${getSiteUrl()}/pt`
      }
    },
    zh: {
      title: '粘贴生成二维码 - 即时二维码生成器 | 免费简单',
      description: '从任何文本即时生成二维码。从剪贴板粘贴，几秒钟内获得二维码。免费、快速、易用的二维码生成器，支持发布选项。',
      keywords: '粘贴生成二维码, 粘贴二维码生成器, 剪贴板转二维码, 即时二维码, 文本转二维码, 粘贴文本二维码, 免费二维码生成器',
      canonicalUrl: `${getSiteUrl()}/zh`,
      alternateUrls: {
        en: getSiteUrl(),
        es: `${getSiteUrl()}/es`,
        zh: `${getSiteUrl()}/zh`,
        fr: `${getSiteUrl()}/fr`,
        am: `${getSiteUrl()}/am`,
        pt: `${getSiteUrl()}/pt`
      }
    },
    fr: {
      title: 'Coller vers Code QR - Générateur Instantané | Gratuit et Facile',
      description: 'Générez des codes QR instantanément à partir de n\'importe quel texte. Collez depuis le presse-papiers et obtenez un code QR en secondes. Générateur gratuit, rapide et facile à utiliser.',
      keywords: 'coller vers code QR, générateur QR coller, presse-papiers vers QR, code QR instantané, texte vers QR, coller texte QR, générateur QR gratuit',
      canonicalUrl: `${getSiteUrl()}/fr`,
      alternateUrls: {
        en: getSiteUrl(),
        es: `${getSiteUrl()}/es`,
        zh: `${getSiteUrl()}/zh`,
        fr: `${getSiteUrl()}/fr`,
        am: `${getSiteUrl()}/am`,
        pt: `${getSiteUrl()}/pt`
      }
    },
    am: {
      title: 'መለጠፍ ወደ QR ኮድ - ወዲያውኑ QR ኮድ ማመንጫ | ነፃ እና ቀላል',
      description: 'ከማንኛውም ጽሑፍ ወዲያውኑ QR ኮዶችን ይፍጠሩ። ከቅንጥብ ቦርድ ይለጥፉ እና በሰከንዶች ውስጥ QR ኮድ ያግኙ። ነፃ፣ ፈጣን እና ቀላል የሆነ QR ኮድ ማመንጫ።',
      keywords: 'መለጠፍ ወደ QR ኮድ, QR ኮድ ማመንጫ መለጠፍ, ቅንጥብ ቦርድ ወደ QR, ወዲያውኑ QR ኮድ, ጽሑፍ ወደ QR, መለጠፍ ጽሑፍ QR, ነፃ QR ማመንጫ',
      canonicalUrl: `${getSiteUrl()}/am`,
      alternateUrls: {
        en: getSiteUrl(),
        es: `${getSiteUrl()}/es`,
        zh: `${getSiteUrl()}/zh`,
        fr: `${getSiteUrl()}/fr`,
        am: `${getSiteUrl()}/am`,
        pt: `${getSiteUrl()}/pt`
      }
    },
    pt: {
      title: 'Colar para Código QR - Gerador Instantâneo | Gratuito e Fácil',
      description: 'Gere códigos QR instantaneamente a partir de qualquer texto. Cole da área de transferência e obtenha código QR em segundos. Gerador gratuito, rápido e fácil de usar.',
      keywords: 'colar para código QR, gerador QR colar, área de transferência para QR, código QR instantâneo, texto para QR, colar texto QR, gerador QR gratuito',
      canonicalUrl: `${getSiteUrl()}/pt`,
      alternateUrls: {
        en: getSiteUrl(),
        es: `${getSiteUrl()}/es`,
        zh: `${getSiteUrl()}/zh`,
        fr: `${getSiteUrl()}/fr`,
        am: `${getSiteUrl()}/am`,
        pt: `${getSiteUrl()}/pt`
      }
    }
  },
  wifi: {
    en: {
      title: 'WiFi QR Code Generator - Share WiFi Password Instantly | Free',
      description: 'Generate WiFi QR codes instantly. Share your WiFi network with guests using scannable QR codes. Free and easy to use WiFi QR code generator.',
      keywords: 'wifi QR code, wifi password QR, share wifi QR, wifi QR generator, free wifi QR, instant wifi QR, wifi network QR',
      canonicalUrl: `${getSiteUrl()}/wifi-qr-code-generator`,
      alternateUrls: {
        en: `${getSiteUrl()}/wifi-qr-code-generator`,
        es: `${getSiteUrl()}/es/wifi-qr-code-generator`,
        zh: `${getSiteUrl()}/zh/wifi-qr-code-generator`,
        fr: `${getSiteUrl()}/fr/wifi-qr-code-generator`,
        am: `${getSiteUrl()}/am/wifi-qr-code-generator`
      }
    },
    es: {
      title: 'Generador de Código QR WiFi - Comparte Contraseña WiFi al Instante | Gratis',
      description: 'Genera códigos QR WiFi al instante. Comparte tu red WiFi con invitados usando códigos QR escaneables. Generador gratuito y fácil de usar.',
      keywords: 'código QR wifi, contraseña wifi QR, compartir wifi QR, generador QR wifi, wifi QR gratis, wifi QR instantáneo',
      canonicalUrl: `${getSiteUrl()}/es/wifi-qr-code-generator`,
      alternateUrls: {
        en: `${getSiteUrl()}/wifi-qr-code-generator`,
        es: `${getSiteUrl()}/es/wifi-qr-code-generator`,
        zh: `${getSiteUrl()}/zh/wifi-qr-code-generator`,
        fr: `${getSiteUrl()}/fr/wifi-qr-code-generator`,
        am: `${getSiteUrl()}/am/wifi-qr-code-generator`
      }
    },
    zh: {
      title: 'WiFi二维码生成器 - 即时分享WiFi密码 | 免费',
      description: '即时生成WiFi二维码。使用可扫描的二维码与客人分享您的WiFi网络。免费易用的WiFi二维码生成器。',
      keywords: 'wifi二维码, wifi密码二维码, 分享wifi二维码, wifi二维码生成器, 免费wifi二维码, 即时wifi二维码',
      canonicalUrl: `${getSiteUrl()}/zh/wifi-qr-code-generator`,
      alternateUrls: {
        en: `${getSiteUrl()}/wifi-qr-code-generator`,
        es: `${getSiteUrl()}/es/wifi-qr-code-generator`,
        zh: `${getSiteUrl()}/zh/wifi-qr-code-generator`,
        fr: `${getSiteUrl()}/fr/wifi-qr-code-generator`,
        am: `${getSiteUrl()}/am/wifi-qr-code-generator`
      }
    },
    fr: {
      title: 'Générateur de Code QR WiFi - Partagez Mot de Passe WiFi Instantanément | Gratuit',
      description: 'Générez des codes QR WiFi instantanément. Partagez votre réseau WiFi avec les invités en utilisant des codes QR scannables. Générateur gratuit et facile à utiliser.',
      keywords: 'code QR wifi, mot de passe wifi QR, partager wifi QR, générateur QR wifi, wifi QR gratuit, wifi QR instantané',
      canonicalUrl: `${getSiteUrl()}/fr/wifi-qr-code-generator`,
      alternateUrls: {
        en: `${getSiteUrl()}/wifi-qr-code-generator`,
        es: `${getSiteUrl()}/es/wifi-qr-code-generator`,
        zh: `${getSiteUrl()}/zh/wifi-qr-code-generator`,
        fr: `${getSiteUrl()}/fr/wifi-qr-code-generator`,
        am: `${getSiteUrl()}/am/wifi-qr-code-generator`
      }
    },
    am: {
      title: 'WiFi QR ኮድ ማመንጫ - WiFi የይለፍ ቃል ወዲያውኑ ያጋሩ | ነፃ',
      description: 'WiFi QR ኮዶችን ወዲያውኑ ይፍጠሩ። የሚታዩ QR ኮዶችን በመጠቀም የእርስዎን WiFi ኔትወርክ ከእንግዶች ጋር ያጋሩ። ነፃ እና ቀላል የሆነ WiFi QR ኮድ ማመንጫ።',
      keywords: 'wifi QR ኮድ, wifi የይለፍ ቃል QR, wifi QR መጋራት, wifi QR ማመንጫ, ነፃ wifi QR, ወዲያውኑ wifi QR',
      canonicalUrl: `${getSiteUrl()}/am/wifi-qr-code-generator`,
      alternateUrls: {
        en: `${getSiteUrl()}/wifi-qr-code-generator`,
        es: `${getSiteUrl()}/es/wifi-qr-code-generator`,
        zh: `${getSiteUrl()}/zh/wifi-qr-code-generator`,
        fr: `${getSiteUrl()}/fr/wifi-qr-code-generator`,
        am: `${getSiteUrl()}/am/wifi-qr-code-generator`,
        pt: `${getSiteUrl()}/pt/wifi-qr-code-generator`
      }
    },
    pt: {
      title: 'Gerador de Código QR WiFi - Compartilhe Senha WiFi Instantaneamente | Gratuito',
      description: 'Gere códigos QR WiFi instantaneamente. Compartilhe sua rede WiFi com convidados usando códigos QR escaneáveis. Gerador gratuito e fácil de usar.',
      keywords: 'código QR wifi, senha wifi QR, compartilhar wifi QR, gerador QR wifi, wifi QR gratuito, wifi QR instantâneo',
      canonicalUrl: `${getSiteUrl()}/pt/wifi-qr-code-generator`,
      alternateUrls: {
        en: `${getSiteUrl()}/wifi-qr-code-generator`,
        es: `${getSiteUrl()}/es/wifi-qr-code-generator`,
        zh: `${getSiteUrl()}/zh/wifi-qr-code-generator`,
        fr: `${getSiteUrl()}/fr/wifi-qr-code-generator`,
        am: `${getSiteUrl()}/am/wifi-qr-code-generator`,
        pt: `${getSiteUrl()}/pt/wifi-qr-code-generator`
      }
    }
  }
  // Add more page types as needed
}

// Generate structured data for different page types
export function generateStructuredData(pageType: string, locale: string, url: string) {
  const baseUrl = getSiteUrl()
  
  const commonStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Paste2QR",
    "description": seoConfigs[pageType]?.[locale as keyof PageSEOConfig]?.description || "QR Code Generator",
    "url": url,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Paste2QR"
    }
  }

  if (pageType === 'home') {
    return {
      ...commonStructuredData,
      "@type": "WebSite",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  }

  return commonStructuredData
}

// Get localized SEO data for a page
export function getLocalizedSEO(pageType: string, locale: string, customUrl?: string): LocalizedSEO {
  const config = seoConfigs[pageType]?.[locale as keyof PageSEOConfig]
  
  if (!config) {
    // Fallback to English if locale not found
    const fallbackConfig = seoConfigs[pageType]?.en
    if (!fallbackConfig) {
      throw new Error(`No SEO config found for page type: ${pageType}`)
    }
    return fallbackConfig
  }

  // Override canonical URL if custom URL provided
  if (customUrl) {
    return {
      ...config,
      canonicalUrl: customUrl
    }
  }

  return config
}
