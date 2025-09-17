import puppeteer from 'puppeteer'

async function testManualInput() {
  let browser
  try {
    console.log('🔤 Testing manual input functionality...')

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
    
    // Test 1: Click on textarea and type
    console.log('✅ Test 1: Click and type manually')
    const textarea = await page.$('textarea[placeholder*="Paste any text"]')
    if (!textarea) {
      throw new Error('Textarea not found')
    }
    
    // Click on textarea
    await textarea.click()
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Type character by character
    await textarea.type('Manual Test')
    
    // Wait for React to update
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check value
    const value1 = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   Value after typing: "${value1}"`)
    
    // Test 2: Try to clear and type again
    console.log('✅ Test 2: Clear and type again')
    
    // Select all text
    await textarea.click()
    await page.keyboard.down('Control')
    await page.keyboard.press('KeyA')
    await page.keyboard.up('Control')
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Type new text (should replace selected text)
    await textarea.type('New Text')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const value2 = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   Value after replace: "${value2}"`)
    
    // Test 3: Try backspace
    console.log('✅ Test 3: Test backspace')
    await textarea.click()
    await page.keyboard.press('End') // Go to end
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Backspace')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const value3 = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   Value after backspace: "${value3}"`)
    
    // Test 4: Check QR code generation
    console.log('✅ Test 4: Check QR code generation')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const qrCode = await page.$('img[alt="Generated QR Code"]')
    if (qrCode) {
      console.log('   ✓ QR code is present')
    } else {
      console.log('   ❌ QR code is missing')
    }
    
    // Test 5: Test paste button
    console.log('✅ Test 5: Test paste button')
    const pasteButton = await page.$('button:has-text("Paste to QR")')
    if (pasteButton) {
      console.log('   ✓ Paste button found')
      // Note: We can't actually test paste in headless mode, but we can click it
      await pasteButton.click()
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('   ✓ Paste button clicked')
    } else {
      console.log('   ❌ Paste button not found')
    }
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will stay open for 20 seconds for manual inspection...')
    console.log('   Try typing in the textarea manually to see if it works!')
    await new Promise(resolve => setTimeout(resolve, 20000))

    console.log('\n🎉 Manual input test completed!')

  } catch (error) {
    console.error('❌ Manual input test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testManualInput()
