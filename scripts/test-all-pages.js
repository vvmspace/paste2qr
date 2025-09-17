import puppeteer from 'puppeteer'

async function testAllPages() {
  console.log('🔍 Checking all pages for absence of "Paste and Generate" button...')

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })

  const locales = [
    { code: 'en', name: 'English', path: '/' },
    { code: 'es', name: 'Spanish', path: '/es' },
    { code: 'zh', name: 'Chinese', path: '/zh' },
    { code: 'fr', name: 'French', path: '/fr' },
    { code: 'am', name: 'Amharic', path: '/am' },
    { code: 'pt', name: 'Portuguese', path: '/pt' },
  ]

  const pages = [
    { name: 'Home', path: '' },
    { name: 'WiFi QR Generator', path: '/wifi-qr-code-generator' },
    { name: 'Phone QR Code', path: '/phone-number-qr-code' },
    { name: 'Email QR Code', path: '/email-qr-code-generator' },
    { name: 'SMS QR Maker', path: '/sms-qr-code-maker' },
    { name: 'Contact QR Code', path: '/contact-info-qr-code' },
  ]

  let allPagesPassed = true

  for (const locale of locales) {
    console.log(`\n🌍 Checking ${locale.name} (${locale.code})...`)

    for (const pageInfo of pages) {
      const url = `http://localhost:3000${locale.path}${pageInfo.path}`
      console.log(`  📄 ${pageInfo.name}: ${url}`)

      try {
        await page.goto(url, { waitUntil: 'networkidle0' })
        
        // Wait for i18n to load
        await new Promise(resolve => setTimeout(resolve, 1000))

        const content = await page.evaluate(() => {
          // Check for any buttons with "Paste" or "Generate" text
          const buttons = Array.from(document.querySelectorAll('button'))
          const buttonTexts = buttons.map(btn => btn.textContent?.trim() || '').filter(text => text.length > 0)
          
          // Check for "Paste and Generate" or similar text
          const hasPasteGenerateButton = buttonTexts.some(text => 
            text.includes('Paste') && text.includes('Generate') ||
            text.includes('Pegar') && text.includes('Generar') ||
            text.includes('粘贴') && text.includes('生成') ||
            text.includes('Coller') && text.includes('Générer') ||
            text.includes('መለጠፍ') && text.includes('መፍጠር')
          )

          // Get Hero content
          const heroTitle = document.querySelector('main h2')?.textContent || ''
          const heroSubtitle = document.querySelector('main p')?.textContent || ''
          
          // Check if there's a button in the Hero section
          const heroSection = document.querySelector('main .px-6.py-8.text-center')
          const heroButtons = heroSection ? Array.from(heroSection.querySelectorAll('button')) : []
          const heroButtonTexts = heroButtons.map(btn => btn.textContent?.trim() || '')

          return {
            hasPasteGenerateButton,
            buttonTexts,
            heroTitle,
            heroSubtitle,
            heroButtonTexts,
            url: window.location.href
          }
        })

        if (content.hasPasteGenerateButton) {
          console.log(`    ❌ Found "Paste and Generate" button: ${content.buttonTexts.join(', ')}`)
          allPagesPassed = false
        } else {
          console.log(`    ✅ "Paste and Generate" button not found`)
        }

        // Check Hero section
        if (content.heroButtonTexts.length > 0) {
          console.log(`    ❌ Found buttons in Hero section: ${content.heroButtonTexts.join(', ')}`)
          allPagesPassed = false
        } else {
          console.log(`    ✅ No buttons in Hero section`)
        }

        console.log(`    📝 Hero Title: ${content.heroTitle}`)
        console.log(`    📝 Hero Subtitle: ${content.heroSubtitle}`)

      } catch (error) {
        console.log(`    ❌ Page loading error: ${error.message}`)
        allPagesPassed = false
      }
    }
  }

  await browser.close()

  if (allPagesPassed) {
    console.log('\n🎉 All pages passed the check! "Paste and Generate" button removed everywhere.')
  } else {
    console.log('\n❌ Some pages failed the check. Fix required.')
  }

  return allPagesPassed
}

testAllPages().catch(console.error)
