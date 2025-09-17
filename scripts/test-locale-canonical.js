import puppeteer from 'puppeteer'

async function testLocaleCanonical() {
  let browser
  try {
    console.log('🌍 Testing Locale and Canonical Links...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Check main page locale and canonical
    console.log('\n✅ Test 1: Check Main Page Locale and Canonical')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const htmlLang = await page.evaluate(() => document.documentElement.lang)
    console.log(`   HTML lang attribute: ${htmlLang}`)
    
    const canonicalLink = await page.$('link[rel="canonical"]')
    if (canonicalLink) {
      const canonicalHref = await canonicalLink.evaluate(el => el.href)
      console.log(`   Canonical URL: ${canonicalHref}`)
      
      const hasCorrectCanonical = canonicalHref === 'http://localhost:3000/'
      console.log(`   Correct canonical URL: ${hasCorrectCanonical ? '✓' : '❌'}`)
    } else {
      console.log(`   Canonical link: ❌ (not found)`)
    }
    
    // Test 2: Check MDX page canonical
    console.log('\n✅ Test 2: Check MDX Page Canonical')
    await page.goto('http://localhost:3000/wifi-qr-code-generator', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mdxCanonicalLink = await page.$('link[rel="canonical"]')
    if (mdxCanonicalLink) {
      const mdxCanonicalHref = await mdxCanonicalLink.evaluate(el => el.href)
      console.log(`   MDX Canonical URL: ${mdxCanonicalHref}`)
      
      const hasCorrectMDXCanonical = mdxCanonicalHref === 'http://localhost:3000/wifi-qr-code-generator'
      console.log(`   Correct MDX canonical URL: ${hasCorrectMDXCanonical ? '✓' : '❌'}`)
    } else {
      console.log(`   MDX Canonical link: ❌ (not found)`)
    }
    
    // Test 3: Check another MDX page canonical
    console.log('\n✅ Test 3: Check Another MDX Page Canonical')
    await page.goto('http://localhost:3000/phone-number-qr-code', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const phoneCanonicalLink = await page.$('link[rel="canonical"]')
    if (phoneCanonicalLink) {
      const phoneCanonicalHref = await phoneCanonicalLink.evaluate(el => el.href)
      console.log(`   Phone Canonical URL: ${phoneCanonicalHref}`)
      
      const hasCorrectPhoneCanonical = phoneCanonicalHref === 'http://localhost:3000/phone-number-qr-code'
      console.log(`   Correct phone canonical URL: ${hasCorrectPhoneCanonical ? '✓' : '❌'}`)
    } else {
      console.log(`   Phone Canonical link: ❌ (not found)`)
    }
    
    // Test 4: Check published QR page canonical
    console.log('\n✅ Test 4: Check Published QR Page Canonical')
    await page.goto('http://localhost:3000/qr/mfnxhmfp_1hww6c', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const publishedCanonicalLink = await page.$('link[rel="canonical"]')
    if (publishedCanonicalLink) {
      const publishedCanonicalHref = await publishedCanonicalLink.evaluate(el => el.href)
      console.log(`   Published Canonical URL: ${publishedCanonicalHref}`)
      
      const hasCorrectPublishedCanonical = publishedCanonicalHref === 'http://localhost:3000/qr/mfnxhmfp_1hww6c'
      console.log(`   Correct published canonical URL: ${hasCorrectPublishedCanonical ? '✓' : '❌'}`)
    } else {
      console.log(`   Published Canonical link: ❌ (not found)`)
    }
    
    // Test 5: Check OpenGraph locale
    console.log('\n✅ Test 5: Check OpenGraph Locale')
    const ogLocale = await page.evaluate(() => {
      const meta = document.querySelector('meta[property="og:locale"]')
      return meta ? meta.getAttribute('content') : null
    })
    console.log(`   OpenGraph locale: ${ogLocale}`)
    
    const hasCorrectOGLocale = ogLocale === 'en_US'
    console.log(`   Correct OpenGraph locale: ${hasCorrectOGLocale ? '✓' : '❌'}`)
    
    // Test 6: Check language switcher functionality
    console.log('\n✅ Test 6: Check Language Switcher')
    const languageSwitcher = await page.$('[data-testid="language-switcher"]')
    if (languageSwitcher) {
      console.log(`   Language switcher found: ✓`)
      
      // Try to click and see if dropdown opens
      await languageSwitcher.click()
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const dropdown = await page.$('[data-testid="language-dropdown"]')
      console.log(`   Language dropdown opens: ${dropdown ? '✓' : '❌'}`)
    } else {
      console.log(`   Language switcher: ❌ (not found)`)
    }
    
    // Test 7: Check all canonical links on different pages
    console.log('\n✅ Test 7: Check All Canonical Links')
    const pages = [
      { url: 'http://localhost:3000/email-qr-code-generator', expected: 'http://localhost:3000/email-qr-code-generator' },
      { url: 'http://localhost:3000/sms-qr-code-maker', expected: 'http://localhost:3000/sms-qr-code-maker' }
    ]
    
    for (const pageInfo of pages) {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle0' })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const canonicalLink = await page.$('link[rel="canonical"]')
      if (canonicalLink) {
        const canonicalHref = await canonicalLink.evaluate(el => el.href)
        const isCorrect = canonicalHref === pageInfo.expected
        console.log(`   ${pageInfo.url}: ${canonicalHref} ${isCorrect ? '✓' : '❌'}`)
      } else {
        console.log(`   ${pageInfo.url}: ❌ (no canonical link)`)
      }
    }
    
    console.log('\n🎉 All locale and canonical tests completed!')

  } catch (error) {
    console.error('❌ Locale and canonical test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testLocaleCanonical()
