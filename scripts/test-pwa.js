import puppeteer from 'puppeteer'

async function testPWA() {
  let browser
  try {
    console.log('📱 Testing PWA Functionality...')

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
    
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator
    })
    console.log(`   Service Worker supported: ${swRegistered ? '✓' : '❌'}`)
    
    // Test 3: Check PWA install prompt
    console.log('\n✅ Test 3: Check PWA Install Prompt')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const installPrompt = await page.$('.fixed.bottom-20')
    const hasInstallPrompt = installPrompt !== null
    console.log(`   Install prompt visible: ${hasInstallPrompt ? '✓' : '❌'}`)
    
    // Test 4: Check PWA meta tags
    console.log('\n✅ Test 4: Check PWA Meta Tags')
    const manifestLink = await page.$('link[rel="manifest"]')
    const hasManifestLink = manifestLink !== null
    console.log(`   Manifest link: ${hasManifestLink ? '✓' : '❌'}`)
    
    const themeColor = await page.$('meta[name="theme-color"]')
    const hasThemeColor = themeColor !== null
    console.log(`   Theme color meta: ${hasThemeColor ? '✓' : '❌'}`)
    
    const appleTouchIcon = await page.$('link[rel="apple-touch-icon"]')
    const hasAppleTouchIcon = appleTouchIcon !== null
    console.log(`   Apple touch icon: ${hasAppleTouchIcon ? '✓' : '❌'}`)
    
    // Test 5: Check icons exist
    console.log('\n✅ Test 5: Check PWA Icons')
    const icon192 = await page.goto('http://localhost:3000/icon-192x192.png', { waitUntil: 'networkidle0' })
    const icon192Status = icon192.status()
    console.log(`   Icon 192x192: ${icon192Status === 200 ? '✓' : '❌'}`)
    
    const icon512 = await page.goto('http://localhost:3000/icon-512x512.png', { waitUntil: 'networkidle0' })
    const icon512Status = icon512.status()
    console.log(`   Icon 512x512: ${icon512Status === 200 ? '✓' : '❌'}`)
    
    const appleIcon = await page.goto('http://localhost:3000/apple-touch-icon.png', { waitUntil: 'networkidle0' })
    const appleIconStatus = appleIcon.status()
    console.log(`   Apple touch icon: ${appleIconStatus === 200 ? '✓' : '❌'}`)
    
    // Test 6: Check PWA capabilities
    console.log('\n✅ Test 6: Check PWA Capabilities')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    
    // Check if service worker is registered
    const swController = await page.evaluate(() => {
      return navigator.serviceWorker && navigator.serviceWorker.controller
    })
    console.log(`   Service Worker registered: ${swController ? '✓' : '❌'}`)
    
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
    
    console.log('\n🎉 All PWA tests completed!')

  } catch (error) {
    console.error('❌ PWA test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testPWA()
