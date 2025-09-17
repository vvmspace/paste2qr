import puppeteer from 'puppeteer'

async function testTextChange() {
  let browser
  try {
    console.log('🔤 Testing text change functionality...')

    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Show browser for debugging
      defaultViewport: { width: 375, height: 667 }, // iPhone SE size
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Navigate to the app
    console.log('📱 Navigating to http://localhost:3000...')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Test 1: Check initial state
    console.log('✅ Test 1: Check initial state')
    const textarea = await page.$('textarea[placeholder*="Paste any text"]')
    if (!textarea) {
      throw new Error('Textarea not found')
    }
    
    // Get initial value
    const initialValue = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   Initial value: "${initialValue}"`)
    
    // Test 2: Clear textarea and type new text
    console.log('✅ Test 2: Clear and type new text')
    await textarea.click()
    await page.keyboard.down('Control')
    await page.keyboard.press('KeyA')
    await page.keyboard.up('Control')
    await page.keyboard.press('Delete')
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Type new text
    await textarea.type('Test Text Change')
    
    // Wait for text to be set
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if text changed
    const newValue = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   New value: "${newValue}"`)
    
    if (newValue === 'Test Text Change') {
      console.log('   ✓ Text changed successfully')
    } else {
      console.log('   ❌ Text did not change')
    }
    
    // Test 3: Check if QR code is generated
    console.log('✅ Test 3: Check QR code generation')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait for QR generation
    
    const qrCode = await page.$('img[alt="Generated QR Code"]')
    if (qrCode) {
      console.log('   ✓ QR code generated')
    } else {
      console.log('   ❌ QR code not generated')
    }
    
    // Test 4: Try to change text again
    console.log('✅ Test 4: Change text again')
    await textarea.click()
    await page.keyboard.down('Control')
    await page.keyboard.press('KeyA')
    await page.keyboard.up('Control')
    await textarea.type('Another Test')
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const finalValue = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   Final value: "${finalValue}"`)
    
    if (finalValue === 'Another Test') {
      console.log('   ✓ Text changed again successfully')
    } else {
      console.log('   ❌ Text did not change again')
    }
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will stay open for 10 seconds for manual inspection...')
    await new Promise(resolve => setTimeout(resolve, 10000))

    console.log('\n🎉 Text change test completed!')

  } catch (error) {
    console.error('❌ Text change test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testTextChange()
