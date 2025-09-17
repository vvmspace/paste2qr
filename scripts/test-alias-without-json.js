import puppeteer from 'puppeteer'

async function testAliasWithoutJson() {
  let browser
  try {
    console.log('🔗 Testing Alias Functionality Without JSON Files...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Simple alias without JSON file
    console.log('\n✅ Test 1: Simple Alias Without JSON')
    await page.goto('http://localhost:3000/qr/hello-world', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea1 = await page.$('textarea')
    if (textarea1) {
      const textValue1 = await textarea1.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue1}"`)
      
      const hasText1 = textValue1.length > 0
      console.log(`   Has text content: ${hasText1 ? '✓' : '❌'}`)
      
      // Check if QR code is generated
      const qrCode1 = await page.$('.w-40.h-40')
      const hasQRCode1 = qrCode1 !== null
      console.log(`   QR code generated: ${hasQRCode1 ? '✓' : '❌'}`)
    }
    
    // Test 2: URL alias without JSON file
    console.log('\n✅ Test 2: URL Alias Without JSON')
    await page.goto('http://localhost:3000/qr/https%3A%2F%2Fexample.com', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea2 = await page.$('textarea')
    if (textarea2) {
      const textValue2 = await textarea2.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue2}"`)
      
      const hasText2 = textValue2.length > 0
      console.log(`   Has text content: ${hasText2 ? '✓' : '❌'}`)
      
      // Check if QR code is generated
      const qrCode2 = await page.$('.w-40.h-40')
      const hasQRCode2 = qrCode2 !== null
      console.log(`   QR code generated: ${hasQRCode2 ? '✓' : '❌'}`)
    }
    
    // Test 3: Base64 alias without JSON file
    console.log('\n✅ Test 3: Base64 Alias Without JSON')
    await page.goto('http://localhost:3000/qr/b64_aGVsbG8gd29ybGQ', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea3 = await page.$('textarea')
    if (textarea3) {
      const textValue3 = await textarea3.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue3}"`)
      
      const hasText3 = textValue3.length > 0
      console.log(`   Has text content: ${hasText3 ? '✓' : '❌'}`)
      
      // Check if QR code is generated
      const qrCode3 = await page.$('.w-40.h-40')
      const hasQRCode3 = qrCode3 !== null
      console.log(`   QR code generated: ${hasQRCode3 ? '✓' : '❌'}`)
    }
    
    // Test 4: Cyrillic alias without JSON file
    console.log('\n✅ Test 4: Cyrillic Alias Without JSON')
    await page.goto('http://localhost:3000/qr/b64_0J_RgNC40LLQtdGCINC80LjRgA', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea4 = await page.$('textarea')
    if (textarea4) {
      const textValue4 = await textarea4.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue4}"`)
      
      const hasText4 = textValue4.length > 0
      console.log(`   Has text content: ${hasText4 ? '✓' : '❌'}`)
      
      // Check if QR code is generated
      const qrCode4 = await page.$('.w-40.h-40')
      const hasQRCode4 = qrCode4 !== null
      console.log(`   QR code generated: ${hasQRCode4 ? '✓' : '❌'}`)
    }
    
    // Test 5: Chinese alias without JSON file
    console.log('\n✅ Test 5: Chinese Alias Without JSON')
    await page.goto('http://localhost:3000/qr/b64_5L2g5aW95LiW55WM', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea5 = await page.$('textarea')
    if (textarea5) {
      const textValue5 = await textarea5.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue5}"`)
      
      const hasText5 = textValue5.length > 0
      console.log(`   Has text content: ${hasText5 ? '✓' : '❌'}`)
      
      // Check if QR code is generated
      const qrCode5 = await page.$('.w-40.h-40')
      const hasQRCode5 = qrCode5 !== null
      console.log(`   QR code generated: ${hasQRCode5 ? '✓' : '❌'}`)
    }
    
    // Test 6: Check console errors
    console.log('\n✅ Test 6: Check Console Errors')
    const logs = await page.evaluate(() => {
      return window.console._logs || []
    })
    
    const errors = logs.filter(log => log.level === 'error')
    console.log(`   Console errors: ${errors.length}`)
    if (errors.length > 0) {
      errors.forEach(error => console.log(`   Error: ${error.message}`))
    }
    
    console.log('\n🎉 All alias without JSON tests completed!')

  } catch (error) {
    console.error('❌ Alias without JSON test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testAliasWithoutJson()
