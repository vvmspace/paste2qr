import puppeteer from 'puppeteer'

async function testURLAutofillSpecific() {
  let browser
  try {
    console.log('🔗 Testing Specific URL Autofill Logic...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Check main page (should have URL)
    console.log('\n✅ Test 1: Check Main Page URL Autofill')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mainTextarea = await page.$('textarea')
    if (mainTextarea) {
      const mainValue = await mainTextarea.evaluate(el => el.value)
      console.log(`   Main page textarea: "${mainValue}"`)
      
      const hasMainURL = mainValue.includes('http://localhost:3000/')
      console.log(`   Main page URL autofilled: ${hasMainURL ? '✓' : '❌'}`)
    }
    
    // Test 2: Check MDX page (should NOT have URL)
    console.log('\n✅ Test 2: Check MDX Page (No URL Autofill)')
    await page.goto('http://localhost:3000/wifi-qr-code-generator', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mdxTextarea = await page.$('textarea')
    if (mdxTextarea) {
      const mdxValue = await mdxTextarea.evaluate(el => el.value)
      console.log(`   MDX page textarea: "${mdxValue}"`)
      
      const hasMDXURL = mdxValue.includes('http://localhost:3000/wifi-qr-code-generator')
      console.log(`   MDX page URL autofilled (should be false): ${hasMDXURL ? '❌' : '✓'}`)
      
      const isEmpty = mdxValue === ''
      console.log(`   MDX page textarea is empty: ${isEmpty ? '✓' : '❌'}`)
    }
    
    // Test 3: Check another MDX page
    console.log('\n✅ Test 3: Check Another MDX Page')
    await page.goto('http://localhost:3000/phone-number-qr-code', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const phoneTextarea = await page.$('textarea')
    if (phoneTextarea) {
      const phoneValue = await phoneTextarea.evaluate(el => el.value)
      console.log(`   Phone page textarea: "${phoneValue}"`)
      
      const hasPhoneURL = phoneValue.includes('http://localhost:3000/phone-number-qr-code')
      console.log(`   Phone page URL autofilled (should be false): ${hasPhoneURL ? '❌' : '✓'}`)
    }
    
    // Test 4: Check published QR page (should have original text)
    console.log('\n✅ Test 4: Check Published QR Page')
    await page.goto('http://localhost:3000/qr/mfnxhmfp_1hww6c', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const publishedTextarea = await page.$('textarea')
    if (publishedTextarea) {
      const publishedValue = await publishedTextarea.evaluate(el => el.value)
      console.log(`   Published page textarea: "${publishedValue}"`)
      
      const hasOriginalText = publishedValue === 'https://link.chess.com/friend/bopYiG'
      console.log(`   Published page has original text: ${hasOriginalText ? '✓' : '❌'}`)
      
      const hasPublishedURL = publishedValue.includes('http://localhost:3000/qr/')
      console.log(`   Published page URL autofilled (should be false): ${hasPublishedURL ? '❌' : '✓'}`)
    }
    
    // Test 5: Check email QR page
    console.log('\n✅ Test 5: Check Email QR Page')
    await page.goto('http://localhost:3000/email-qr-code-generator', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const emailTextarea = await page.$('textarea')
    if (emailTextarea) {
      const emailValue = await emailTextarea.evaluate(el => el.value)
      console.log(`   Email page textarea: "${emailValue}"`)
      
      const hasEmailURL = emailValue.includes('http://localhost:3000/email-qr-code-generator')
      console.log(`   Email page URL autofilled (should be false): ${hasEmailURL ? '❌' : '✓'}`)
    }
    
    // Test 6: Check SMS QR page
    console.log('\n✅ Test 6: Check SMS QR Page')
    await page.goto('http://localhost:3000/sms-qr-code-maker', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const smsTextarea = await page.$('textarea')
    if (smsTextarea) {
      const smsValue = await smsTextarea.evaluate(el => el.value)
      console.log(`   SMS page textarea: "${smsValue}"`)
      
      const hasSMSURL = smsValue.includes('http://localhost:3000/sms-qr-code-maker')
      console.log(`   SMS page URL autofilled (should be false): ${hasSMSURL ? '❌' : '✓'}`)
    }
    
    // Test 7: Test typing functionality on empty pages
    console.log('\n✅ Test 7: Test Typing on Empty Pages')
    await page.goto('http://localhost:3000/wifi-qr-code-generator', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const testTextarea = await page.$('textarea')
    if (testTextarea) {
      await testTextarea.click()
      await page.keyboard.type('Test typing on MDX page')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const typedValue = await testTextarea.evaluate(el => el.value)
      console.log(`   After typing on MDX page: "${typedValue}"`)
      
      const typingWorks = typedValue === 'Test typing on MDX page'
      console.log(`   Typing works on MDX page: ${typingWorks ? '✓' : '❌'}`)
    }
    
    console.log('\n🎉 All specific URL autofill tests completed!')

  } catch (error) {
    console.error('❌ Specific URL autofill test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testURLAutofillSpecific()
