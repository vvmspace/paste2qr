import puppeteer from 'puppeteer'

async function testLocalizationFix() {
  console.log('🔍 Testing localization fixes...')

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })

  const locales = [
    { code: 'en', name: 'English', path: '/' },
    { code: 'es', name: 'Spanish', path: '/es' },
    { code: 'zh', name: 'Chinese', path: '/zh' },
    { code: 'fr', name: 'French', path: '/fr' },
    { code: 'am', name: 'Amharic', path: '/am' },
  ]

  const expectedHeroTexts = {
    en: {
      title: 'Paste to QR Code',
      subtitle: 'Paste any text from your clipboard and get a QR code instantly. No typing, no complexity - just paste and generate.',
      buttonText: 'Paste & Generate',
    },
    es: {
      title: 'Pegar a Código QR',
      subtitle: 'Pega cualquier texto de tu portapapeles y obtén un código QR al instante. Sin escribir, sin complejidad - solo pega y genera.',
      buttonText: 'Pegar y Generar',
    },
    zh: {
      title: '粘贴生成二维码',
      subtitle: '从剪贴板粘贴任何文本，立即生成二维码。无需输入，无需复杂操作 - 只需粘贴并生成。',
      buttonText: '粘贴并生成',
    },
    fr: {
      title: 'Coller vers Code QR',
      subtitle: 'Collez n\'importe quel texte de votre presse-papier et obtenez un code QR instantanément. Pas de frappe, pas de complexité - collez et générez.',
      buttonText: 'Coller et Générer',
    },
    am: {
      title: 'መለጠፍ ወደ QR ኮድ',
      subtitle: 'ከቅንጥብ ሰሌዳዎ ማንኛውንም ጽሑፍ ይለጥፉ እና ወዲያውኑ QR ኮድ ያግኙ። መተየብ የለም፣ ውስብስብነት የለም - ዝም ብለው ይለጥፉ እና ይፍጠሩ።',
      buttonText: 'መለጠፍ እና መፍጠር',
    },
  }

  for (const locale of locales) {
    console.log(`\n🌍 Checking ${locale.name} (${locale.code})...`)

    const url = `http://localhost:3000${locale.path}`
    await page.goto(url, { waitUntil: 'networkidle0' })

    // Wait for i18n to load
    await new Promise(resolve => setTimeout(resolve, 1000))

    const content = await page.evaluate((localeCode, currentUrl) => {
      // Get page title
      const title = document.querySelector('title')?.textContent || ''

      // Get H1 from header
      const h1 = document.querySelector('div.bg-white h1')?.textContent || ''

      // Get Hero content
      const heroTitle = document.querySelector('main h2')?.textContent || ''
      const heroSubtitle = document.querySelector('main p')?.textContent || ''
      const heroButton = document.querySelector('button.inline-flex')?.textContent || ''

      // Get MDX content (should be below the fold)
      const mdxContent = document.querySelector('.prose')?.textContent || ''

      return {
        title,
        h1,
        heroTitle,
        heroSubtitle,
        heroButton,
        mdxContent: mdxContent.substring(0, 200) + '...',
        url: currentUrl
      }
    }, locale.code, url)

    console.log(`  📄 Title: ${content.title}`)
    console.log(`  🏷️  H1: ${content.h1}`)
    console.log(`  🎯 Hero Title: ${content.heroTitle}`)
    console.log(`  📝 Hero Subtitle: ${content.heroSubtitle}`)
    console.log(`  🔘 Hero Button: ${content.heroButton}`)
    console.log(`  📚 MDX Content: ${content.mdxContent}`)

    // Check if Hero content is localized
    const expected = expectedHeroTexts[locale.code]
    if (expected) {
      const titleMatch = content.heroTitle.includes(expected.title) || content.heroTitle === expected.title
      const subtitleMatch = content.heroSubtitle.includes(expected.subtitle) || content.heroSubtitle === expected.subtitle
      const buttonMatch = content.heroButton.includes(expected.buttonText) || content.heroButton === expected.buttonText

      console.log(`  ✅ Hero Title Match: ${titleMatch}`)
      console.log(`  ✅ Hero Subtitle Match: ${subtitleMatch}`)
      console.log(`  ✅ Hero Button Match: ${buttonMatch}`)

      if (titleMatch && subtitleMatch && buttonMatch) {
        console.log(`  🎉 ${locale.name} Hero content is properly localized!`)
      } else {
        console.log(`  ❌ ${locale.name} Hero content is NOT properly localized!`)
      }
    }

    // Check if MDX content exists
    if (content.mdxContent && content.mdxContent.length > 50) {
      console.log(`  ✅ MDX content is present`)
    } else {
      console.log(`  ❌ MDX content is missing or too short`)
    }
  }

  await browser.close()
  console.log('\n✅ Testing completed!')
}

testLocalizationFix().catch(console.error)
