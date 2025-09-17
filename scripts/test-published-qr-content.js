import puppeteer from 'puppeteer'

async function testPublishedQRContent() {
  let browser
  try {
    console.log('🔗 Testing Published QR Content Display...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Check first published QR page content
    console.log('\n✅ Test 1: Check First Published QR Page Content')
    const url1 = 'http://localhost:3000/qr/mfnxhmfp_1hww6c'
    console.log(`   Testing URL: ${url1}`)
    
    await page.goto(url1, { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    const title1 = await page.title()
    console.log(`   Page title: ${title1}`)
    
    const textarea1 = await page.$('textarea')
    if (textarea1) {
      const textareaValue1 = await textarea1.evaluate(el => el.value)
      console.log(`   Textarea value: "${textareaValue1}"`)
      
      const hasContent1 = textareaValue1.length > 0
      console.log(`   Has original content: ${hasContent1 ? '✓' : '❌'}`)
      
      if (hasContent1) {
        console.log(`   Content length: ${textareaValue1.length} characters`)
      }
    }
    
    const qrCode1 = await page.$('canvas')
    console.log(`   QR Code displayed: ${qrCode1 ? '✓' : '❌'}`)
    
    // Test 2: Check second published QR page content
    console.log('\n✅ Test 2: Check Second Published QR Page Content')
    const url2 = 'http://localhost:3000/qr/mfncr4hh_h64n7j'
    console.log(`   Testing URL: ${url2}`)
    
    await page.goto(url2, { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    const title2 = await page.title()
    console.log(`   Page title: ${title2}`)
    
    const textarea2 = await page.$('textarea')
    if (textarea2) {
      const textareaValue2 = await textarea2.evaluate(el => el.value)
      console.log(`   Textarea value: "${textareaValue2}"`)
      
      const hasContent2 = textareaValue2.length > 0
      console.log(`   Has original content: ${hasContent2 ? '✓' : '❌'}`)
      
      if (hasContent2) {
        console.log(`   Content length: ${textareaValue2.length} characters`)
      }
    }
    
    const qrCode2 = await page.$('canvas')
    console.log(`   QR Code displayed: ${qrCode2 ? '✓' : '❌'}`)
    
    // Test 3: Check if content is editable
    console.log('\n✅ Test 3: Check Content Editability')
    if (textarea2) {
      await textarea2.click()
      await page.keyboard.type('Additional text')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const editedValue = await textarea2.evaluate(el => el.value)
      console.log(`   After editing: "${editedValue}"`)
      
      const isEditable = editedValue.includes('Additional text')
      console.log(`   Content is editable: ${isEditable ? '✓' : '❌'}`)
    }
    
    // Test 4: Check QR code regeneration
    console.log('\n✅ Test 4: Check QR Code Regeneration')
    if (textarea2) {
      // Clear and type new content
      await textarea2.click()
      await page.keyboard.down('Control')
      await page.keyboard.press('KeyA')
      await page.keyboard.up('Control')
      await page.keyboard.type('New QR content')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newQRCode = await page.$('canvas')
      console.log(`   New QR code generated: ${newQRCode ? '✓' : '❌'}`)
    }
    
    // Test 5: Check main page behavior (should have URL)
    console.log('\n✅ Test 5: Check Main Page Behavior')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mainTextarea = await page.$('textarea')
    if (mainTextarea) {
      const mainValue = await mainTextarea.evaluate(el => el.value)
      console.log(`   Main page textarea: ${mainValue}`)
      
      const hasMainURL = mainValue.includes('http://localhost:3000')
      console.log(`   Main page has URL: ${hasMainURL ? '✓' : '❌'}`)
    }
    
    console.log('\n🎉 All published QR content tests completed!')

  } catch (error) {
    console.error('❌ Published QR content test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testPublishedQRContent()
