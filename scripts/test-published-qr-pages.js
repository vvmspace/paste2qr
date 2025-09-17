import puppeteer from 'puppeteer'

async function testPublishedQRPages() {
  let browser
  try {
    console.log('🔗 Testing Published QR Pages...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Check first published QR page
    console.log('\n✅ Test 1: Check First Published QR Page')
    const url1 = 'http://localhost:3000/qr/mfnxhmfp_1hww6c'
    console.log(`   Testing URL: ${url1}`)
    
    await page.goto(url1, { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const title1 = await page.title()
    console.log(`   Page title: ${title1}`)
    
    const hasQRGenerator = await page.$('textarea[placeholder*="Paste any text"]')
    console.log(`   QR Generator present: ${hasQRGenerator ? '✓' : '❌'}`)
    
    const hasPasteButton = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Paste'))
    )
    const hasPasteButtonExists = await hasPasteButton.evaluate(el => el !== null)
    console.log(`   Paste button present: ${hasPasteButtonExists ? '✓' : '❌'}`)
    
    // Test 2: Check second published QR page
    console.log('\n✅ Test 2: Check Second Published QR Page')
    const url2 = 'http://localhost:3000/qr/mfncr4hh_h64n7j'
    console.log(`   Testing URL: ${url2}`)
    
    await page.goto(url2, { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const title2 = await page.title()
    console.log(`   Page title: ${title2}`)
    
    const hasQRGenerator2 = await page.$('textarea[placeholder*="Paste any text"]')
    console.log(`   QR Generator present: ${hasQRGenerator2 ? '✓' : '❌'}`)
    
    // Test 3: Check if pages load without errors
    console.log('\n✅ Test 3: Check for Console Errors')
    const logs = await page.evaluate(() => {
      return window.console._logs || []
    })
    
    const errors = logs.filter(log => log.level === 'error')
    console.log(`   Console errors: ${errors.length}`)
    if (errors.length > 0) {
      errors.forEach(error => console.log(`     - ${error.message}`))
    }
    
    // Test 4: Check page structure
    console.log('\n✅ Test 4: Check Page Structure')
    const hasHeader = await page.$('header')
    console.log(`   Header present: ${hasHeader ? '✓' : '❌'}`)
    
    const hasMain = await page.$('main')
    console.log(`   Main content present: ${hasMain ? '✓' : '❌'}`)
    
    const hasFixedActionBar = await page.$('.fixed.bottom-0')
    console.log(`   Fixed action bar present: ${hasFixedActionBar ? '✓' : '❌'}`)
    
    // Test 5: Check QR code generation
    console.log('\n✅ Test 5: Check QR Code Generation')
    const textarea = await page.$('textarea')
    if (textarea) {
      await textarea.click()
      await page.keyboard.type('Test QR Code for Published Page')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const qrCode = await page.$('canvas')
      console.log(`   QR Code generated: ${qrCode ? '✓' : '❌'}`)
    }
    
    // Test 6: Check if old URL format returns 404
    console.log('\n✅ Test 6: Check Old URL Format')
    const oldUrl = 'http://localhost:3000/p/mfnxhmfp_1hww6c'
    const response = await page.goto(oldUrl, { waitUntil: 'networkidle0' })
    const status = response?.status()
    console.log(`   Old URL status: ${status}`)
    console.log(`   Old URL blocked: ${status === 404 ? '✓' : '❌'}`)
    
    console.log('\n🎉 All published QR page tests completed!')

  } catch (error) {
    console.error('❌ Published QR page test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testPublishedQRPages()
