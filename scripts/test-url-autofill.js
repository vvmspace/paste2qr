import puppeteer from 'puppeteer'

async function testURLAutofill() {
  let browser
  try {
    console.log('🔗 Testing URL Autofill Behavior...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Check main page URL autofill
    console.log('\n✅ Test 1: Check Main Page URL Autofill')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mainPageTextarea = await page.$('textarea')
    if (mainPageTextarea) {
      const mainPageValue = await mainPageTextarea.evaluate(el => el.value)
      console.log(`   Main page textarea value: ${mainPageValue}`)
      
      const hasMainPageURL = mainPageValue.includes('http://localhost:3000')
      console.log(`   Main page URL autofilled: ${hasMainPageURL ? '✓' : '❌'}`)
    }
    
    // Test 2: Check published QR page (should NOT have URL autofill)
    console.log('\n✅ Test 2: Check Published QR Page (No URL Autofill)')
    await page.goto('http://localhost:3000/qr/mfnxhmfp_1hww6c', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const publishedPageTextarea = await page.$('textarea')
    if (publishedPageTextarea) {
      const publishedPageValue = await publishedPageTextarea.evaluate(el => el.value)
      console.log(`   Published page textarea value: "${publishedPageValue}"`)
      
      const hasPublishedPageURL = publishedPageValue.includes('http://localhost:3000/qr/')
      console.log(`   Published page URL autofilled (should be false): ${hasPublishedPageURL ? '❌' : '✓'}`)
      
      const isEmpty = publishedPageValue === ''
      console.log(`   Published page textarea is empty: ${isEmpty ? '✓' : '❌'}`)
    }
    
    // Test 3: Check another published QR page
    console.log('\n✅ Test 3: Check Another Published QR Page')
    await page.goto('http://localhost:3000/qr/mfncr4hh_h64n7j', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const anotherPublishedTextarea = await page.$('textarea')
    if (anotherPublishedTextarea) {
      const anotherPublishedValue = await anotherPublishedTextarea.evaluate(el => el.value)
      console.log(`   Another published page textarea value: "${anotherPublishedValue}"`)
      
      const hasAnotherPublishedURL = anotherPublishedValue.includes('http://localhost:3000/qr/')
      console.log(`   Another published page URL autofilled (should be false): ${hasAnotherPublishedURL ? '❌' : '✓'}`)
    }
    
    // Test 4: Check MDX page (should have URL autofill)
    console.log('\n✅ Test 4: Check MDX Page URL Autofill')
    await page.goto('http://localhost:3000/wifi-qr-code-generator', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mdxPageTextarea = await page.$('textarea')
    if (mdxPageTextarea) {
      const mdxPageValue = await mdxPageTextarea.evaluate(el => el.value)
      console.log(`   MDX page textarea value: ${mdxPageValue}`)
      
      const hasMDXPageURL = mdxPageValue.includes('http://localhost:3000/wifi-qr-code-generator')
      console.log(`   MDX page URL autofilled: ${hasMDXPageURL ? '✓' : '❌'}`)
    }
    
    // Test 5: Test typing in published page
    console.log('\n✅ Test 5: Test Typing in Published Page')
    await page.goto('http://localhost:3000/qr/mfnxhmfp_1hww6c', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const testTextarea = await page.$('textarea')
    if (testTextarea) {
      await testTextarea.click()
      await page.keyboard.type('Test custom text')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const typedValue = await testTextarea.evaluate(el => el.value)
      console.log(`   Typed value: "${typedValue}"`)
      
      const hasTypedText = typedValue === 'Test custom text'
      console.log(`   Typing works correctly: ${hasTypedText ? '✓' : '❌'}`)
      
      // Check if QR code was generated
      const qrCode = await page.$('canvas')
      console.log(`   QR code generated after typing: ${qrCode ? '✓' : '❌'}`)
    }
    
    console.log('\n🎉 All URL autofill tests completed!')

  } catch (error) {
    console.error('❌ URL autofill test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testURLAutofill()
