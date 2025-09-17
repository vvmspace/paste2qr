import puppeteer from 'puppeteer'

async function testPWAProduction() {
  let browser
  try {
    console.log('📱 Testing PWA in Production Mode...')

    browser = await puppeteer.launch({
      headless: false, // Show browser for PWA testing
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Check manifest.json
    console.log('\n✅ Test 1: Check Manifest')
    await page.goto('http://localhost:3000/manifest.json', { waitUntil: 'networkidle0' })
    const manifestContent = await page.content()
    const hasManifest = manifestContent.includes('"name": "Paste2QR - QR Code Generator"')
    console.log(`   Manifest loaded: ${hasManifest ? '✓' : '❌'}`)
    
    // Test 2: Check service worker registration
    console.log('\n✅ Test 2: Check Service Worker')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 3000)) // Wait for SW registration
    
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator
    })
    console.log(`   Service Worker supported: ${swRegistered ? '✓' : '❌'}`)
    
    // Test 3: Check PWA meta tags
    console.log('\n✅ Test 3: Check PWA Meta Tags')
    const manifestLink = await page.$('link[rel="manifest"]')
    const hasManifestLink = manifestLink !== null
    console.log(`   Manifest link: ${hasManifestLink ? '✓' : '❌'}`)
    
    const themeColor = await page.$('meta[name="theme-color"]')
    const hasThemeColor = themeColor !== null
    console.log(`   Theme color meta: ${hasThemeColor ? '✓' : '❌'}`)
    
    const appleTouchIcon = await page.$('link[rel="apple-touch-icon"]')
    const hasAppleTouchIcon = appleTouchIcon !== null
    console.log(`   Apple touch icon: ${hasAppleTouchIcon ? '✓' : '❌'}`)
    
    // Test 4: Check PWA icons
    console.log('\n✅ Test 4: Check PWA Icons')
    const icon192 = await page.goto('http://localhost:3000/icon-192x192.png', { waitUntil: 'networkidle0' })
    const icon192Status = icon192.status()
    console.log(`   Icon 192x192: ${icon192Status === 200 ? '✓' : '❌'}`)
    
    const icon512 = await page.goto('http://localhost:3000/icon-512x512.png', { waitUntil: 'networkidle0' })
    const icon512Status = icon512.status()
    console.log(`   Icon 512x512: ${icon512Status === 200 ? '✓' : '❌'}`)
    
    const appleIcon = await page.goto('http://localhost:3000/apple-touch-icon.png', { waitUntil: 'networkidle0' })
    const appleIconStatus = appleIcon.status()
    console.log(`   Apple touch icon: ${appleIconStatus === 200 ? '✓' : '❌'}`)
    
    // Test 5: Check PWA capabilities
    console.log('\n✅ Test 5: Check PWA Capabilities')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Check if app can work offline (basic check)
    const canWorkOffline = await page.evaluate(() => {
      return 'serviceWorker' in navigator && 'caches' in window
    })
    console.log(`   Offline capabilities: ${canWorkOffline ? '✓' : '❌'}`)
    
    // Check PWA install prompt functionality
    const installPromptExists = await page.evaluate(() => {
      return document.querySelector('.fixed.bottom-20') !== null
    })
    console.log(`   Install prompt component: ${installPromptExists ? '✓' : '❌'}`)
    
    // Test 6: Check PWA manifest properties
    console.log('\n✅ Test 6: Check PWA Manifest Properties')
    const manifestData = await page.evaluate(async () => {
      try {
        const response = await fetch('/manifest.json')
        return await response.json()
      } catch (error) {
        return null
      }
    })
    
    if (manifestData) {
      console.log(`   App name: ${manifestData.name ? '✓' : '❌'}`)
      console.log(`   Short name: ${manifestData.short_name ? '✓' : '❌'}`)
      console.log(`   Start URL: ${manifestData.start_url ? '✓' : '❌'}`)
      console.log(`   Display mode: ${manifestData.display === 'standalone' ? '✓' : '❌'}`)
      console.log(`   Theme color: ${manifestData.theme_color ? '✓' : '❌'}`)
      console.log(`   Icons count: ${manifestData.icons ? manifestData.icons.length : 0}`)
    } else {
      console.log(`   Manifest data: ❌`)
    }
    
    console.log('\n🎉 All PWA production tests completed!')

  } catch (error) {
    console.error('❌ PWA production test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testPWAProduction()
