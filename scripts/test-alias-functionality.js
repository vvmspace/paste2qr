import puppeteer from 'puppeteer'

async function testAliasFunctionality() {
  let browser
  try {
    console.log('🔗 Testing Alias Functionality...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Test published QR page with existing alias
    console.log('\n✅ Test 1: Check Published QR Page with Existing Alias')
    await page.goto('http://localhost:3000/qr/mfnxhmfp_1hww6c', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea = await page.$('textarea')
    if (textarea) {
      const textValue = await textarea.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue}"`)
      
      const hasText = textValue.length > 0
      console.log(`   Has text content: ${hasText ? '✓' : '❌'}`)
      
      // Check if QR code is generated
      const qrCode = await page.$('.w-40.h-40')
      const hasQRCode = qrCode !== null
      console.log(`   QR code generated: ${hasQRCode ? '✓' : '❌'}`)
    }
    
    // Test 2: Test published QR page with simple alias
    console.log('\n✅ Test 2: Check Published QR Page with Simple Alias')
    await page.goto('http://localhost:3000/qr/hello-world', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea2 = await page.$('textarea')
    if (textarea2) {
      const textValue2 = await textarea2.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue2}"`)
      
      const hasText2 = textValue2.length > 0
      console.log(`   Has text content: ${hasText2 ? '✓' : '❌'}`)
    }
    
    // Test 3: Test published QR page with encoded alias
    console.log('\n✅ Test 3: Check Published QR Page with Encoded Alias')
    await page.goto('http://localhost:3000/qr/b64_aGVsbG8gd29ybGQ%3D', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea3 = await page.$('textarea')
    if (textarea3) {
      const textValue3 = await textarea3.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue3}"`)
      
      const hasText3 = textValue3.length > 0
      console.log(`   Has text content: ${hasText3 ? '✓' : '❌'}`)
    }
    
    // Test 4: Test published QR page with URL alias
    console.log('\n✅ Test 4: Check Published QR Page with URL Alias')
    await page.goto('http://localhost:3000/qr/https%3A%2F%2Fexample.com', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea4 = await page.$('textarea')
    if (textarea4) {
      const textValue4 = await textarea4.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue4}"`)
      
      const hasText4 = textValue4.length > 0
      console.log(`   Has text content: ${hasText4 ? '✓' : '❌'}`)
    }
    
    // Test 5: Test published QR page with invalid alias
    console.log('\n✅ Test 5: Check Published QR Page with Invalid Alias')
    await page.goto('http://localhost:3000/qr/invalid-alias-123', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea5 = await page.$('textarea')
    if (textarea5) {
      const textValue5 = await textarea5.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue5}"`)
      
      const hasText5 = textValue5.length > 0
      console.log(`   Has text content: ${hasText5 ? '✓' : '❌'}`)
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
    
    console.log('\n🎉 All alias functionality tests completed!')

  } catch (error) {
    console.error('❌ Alias functionality test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testAliasFunctionality()
