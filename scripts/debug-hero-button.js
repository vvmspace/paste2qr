import puppeteer from 'puppeteer'

async function debugHeroButton() {
  console.log('🔍 Debugging Hero button...')

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })

  const url = 'http://localhost:3000'
  await page.goto(url, { waitUntil: 'networkidle0' })

  // Wait for i18n to load
  await new Promise(resolve => setTimeout(resolve, 2000))

  const content = await page.evaluate(() => {
    // Find all buttons
    const allButtons = Array.from(document.querySelectorAll('button'))
    
    // Find Hero button specifically
    const heroButton = document.querySelector('main button')
    const heroButtonByClass = document.querySelector('button.inline-flex')
    
    // Get all text content from buttons
    const buttonTexts = allButtons.map(btn => ({
      text: btn.textContent?.trim(),
      className: btn.className,
      tagName: btn.tagName
    }))

    return {
      totalButtons: allButtons.length,
      heroButtonText: heroButton?.textContent?.trim() || 'NOT FOUND',
      heroButtonByClassText: heroButtonByClass?.textContent?.trim() || 'NOT FOUND',
      allButtonTexts: buttonTexts,
      mainElement: document.querySelector('main')?.outerHTML?.substring(0, 500) || 'NOT FOUND'
    }
  })

  console.log('📊 Debug results:')
  console.log(`  🔢 Total buttons: ${content.totalButtons}`)
  console.log(`  🎯 Hero button (main button): "${content.heroButtonText}"`)
  console.log(`  🎯 Hero button (by class): "${content.heroButtonByClassText}"`)
  console.log(`  📝 All buttons:`)
  content.allButtonTexts.forEach((btn, index) => {
    console.log(`    ${index + 1}. "${btn.text}" (${btn.tagName}, ${btn.className})`)
  })
  console.log(`  🏗️  Main element: ${content.mainElement}`)

  await browser.close()
}

debugHeroButton().catch(console.error)
