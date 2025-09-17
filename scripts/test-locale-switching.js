import puppeteer from 'puppeteer'

async function testLocaleSwitching() {
  let browser
  try {
    console.log('🌍 Testing Locale Switching...')

    browser = await puppeteer.launch({
      headless: false, // Show browser for testing
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Check hreflang links
    console.log('\n✅ Test 1: Check hreflang Links')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    
    const hreflangLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('link[rel="alternate"][hreflang]')
      return Array.from(links).map(link => ({
        hreflang: link.getAttribute('hreflang'),
        href: link.getAttribute('href')
      }))
    })
    
    console.log(`   Found ${hreflangLinks.length} hreflang links:`)
    hreflangLinks.forEach(link => {
      console.log(`   - ${link.hreflang}: ${link.href}`)
    })
    
    const expectedLocales = ['en', 'es', 'zh', 'fr']
    const hasAllLocales = expectedLocales.every(locale => 
      hreflangLinks.some(link => link.hreflang === locale)
    )
    console.log(`   All locales present: ${hasAllLocales ? '✓' : '❌'}`)
    
    // Test 2: Check language switcher component
    console.log('\n✅ Test 2: Check Language Switcher')
    const languageSwitcher = await page.$('[data-testid="language-switcher"]')
    const hasLanguageSwitcher = languageSwitcher !== null
    console.log(`   Language switcher present: ${hasLanguageSwitcher ? '✓' : '❌'}`)
    
    if (hasLanguageSwitcher) {
      // Click on language switcher
      await page.click('[data-testid="language-button"]')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check if dropdown is visible
      const dropdown = await page.$('[data-testid="language-dropdown"]')
      const dropdownVisible = dropdown !== null
      console.log(`   Dropdown visible: ${dropdownVisible ? '✓' : '❌'}`)
      
      if (dropdownVisible) {
        // Count language options
        const languageOptions = await page.$$('[data-testid="language-dropdown"] button')
        console.log(`   Language options count: ${languageOptions.length}`)
        
        // Test switching to Spanish
        const spanishButton = await page.$('[data-testid="language-dropdown"] button:nth-child(2)')
        if (spanishButton) {
          await spanishButton.click()
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Check if URL changed
          const currentUrl = page.url()
          const hasLangParam = currentUrl.includes('lang=es')
          console.log(`   URL changed to Spanish: ${hasLangParam ? '✓' : '❌'}`)
          console.log(`   Current URL: ${currentUrl}`)
        }
      }
    }
    
    // Test 3: Test direct URL access with language parameter
    console.log('\n✅ Test 3: Test Direct URL Access')
    await page.goto('http://localhost:3000?lang=zh', { waitUntil: 'networkidle0' })
    
    const currentUrl = page.url()
    const hasChineseParam = currentUrl.includes('lang=zh')
    console.log(`   Chinese URL parameter: ${hasChineseParam ? '✓' : '❌'}`)
    
    // Test 4: Check language switcher state
    console.log('\n✅ Test 4: Check Language Switcher State')
    const currentLanguage = await page.evaluate(() => {
      const button = document.querySelector('[data-testid="language-button"]')
      if (button) {
        const text = button.textContent
        return text.includes('中文') ? 'zh' : text.includes('English') ? 'en' : 'unknown'
      }
      return 'not found'
    })
    console.log(`   Current language display: ${currentLanguage}`)
    
    console.log('\n🎉 All locale switching tests completed!')

  } catch (error) {
    console.error('❌ Locale switching test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testLocaleSwitching()
