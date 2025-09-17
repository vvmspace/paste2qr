import puppeteer from 'puppeteer'

async function testQRGeneration() {
  let browser
  try {
    console.log('🔗 Testing QR Code Generation...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Check main page QR generation
    console.log('\n✅ Test 1: Check Main Page QR Generation')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mainQRCode = await page.$('canvas')
    console.log(`   Main page QR code: ${mainQRCode ? '✓' : '❌'}`)
    
    // Test 2: Check published page QR generation
    console.log('\n✅ Test 2: Check Published Page QR Generation')
    await page.goto('http://localhost:3000/qr/mfnxhmfp_1hww6c', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    const publishedQRCode = await page.$('canvas')
    console.log(`   Published page QR code: ${publishedQRCode ? '✓' : '❌'}`)
    
    // Test 3: Check console for errors
    console.log('\n✅ Test 3: Check Console Errors')
    const logs = await page.evaluate(() => {
      return window.console._logs || []
    })
    
    const errors = logs.filter(log => log.level === 'error')
    console.log(`   Console errors: ${errors.length}`)
    if (errors.length > 0) {
      errors.forEach(error => console.log(`     - ${error.message}`))
    }
    
    // Test 4: Check if QR generation is triggered
    console.log('\n✅ Test 4: Check QR Generation Trigger')
    const textarea = await page.$('textarea')
    if (textarea) {
      const textareaValue = await textarea.evaluate(el => el.value)
      console.log(`   Textarea value: "${textareaValue}"`)
      
      // Trigger a change to see if QR generates
      await textarea.click()
      await page.keyboard.type(' ')
      await page.keyboard.press('Backspace')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const qrAfterChange = await page.$('canvas')
      console.log(`   QR after change: ${qrAfterChange ? '✓' : '❌'}`)
    }
    
    // Test 5: Check if QR generation function exists
    console.log('\n✅ Test 5: Check QR Generation Function')
    const hasQRFunction = await page.evaluate(() => {
      return typeof window.generateQRCode === 'function'
    })
    console.log(`   QR generation function exists: ${hasQRFunction ? '✓' : '❌'}`)
    
    console.log('\n🎉 QR generation tests completed!')

  } catch (error) {
    console.error('❌ QR generation test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testQRGeneration()
