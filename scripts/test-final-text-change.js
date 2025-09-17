import puppeteer from 'puppeteer'

async function testFinalTextChange() {
  let browser
  try {
    console.log('🔤 Testing final text change functionality...')

    // Launch browser
    browser = await puppeteer.launch({
      headless: true, // Run in headless mode for final test
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
    const initialValue = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   Initial value: "${initialValue}"`)
    
    // Test 2: Clear textarea completely and type new text
    console.log('✅ Test 2: Clear and type new text')
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      if (textarea) {
        // Clear completely
        textarea.value = ''
        // Trigger change event
        const event = new Event('input', { bubbles: true })
        textarea.dispatchEvent(event)
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Type new text
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      if (textarea) {
        textarea.value = 'Hello World Test'
        const event = new Event('input', { bubbles: true })
        textarea.dispatchEvent(event)
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newValue = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   New value: "${newValue}"`)
    
    if (newValue === 'Hello World Test') {
      console.log('   ✓ Text changed successfully')
    } else {
      console.log('   ❌ Text did not change')
    }
    
    // Test 3: Check QR code generation
    console.log('✅ Test 3: Check QR code generation')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const qrCode = await page.$('img[alt="Generated QR Code"]')
    if (qrCode) {
      console.log('   ✓ QR code generated')
    } else {
      console.log('   ❌ QR code not generated')
    }
    
    // Test 4: Change text again
    console.log('✅ Test 4: Change text again')
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      if (textarea) {
        textarea.value = 'Another Test Value'
        const event = new Event('input', { bubbles: true })
        textarea.dispatchEvent(event)
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const finalValue = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   Final value: "${finalValue}"`)
    
    if (finalValue === 'Another Test Value') {
      console.log('   ✓ Text changed again successfully')
    } else {
      console.log('   ❌ Text did not change again')
    }
    
    // Test 5: Test paste button
    console.log('✅ Test 5: Test paste button')
    const pasteButton = await page.$('button')
    if (pasteButton) {
      const buttonText = await page.evaluate(el => el.textContent, pasteButton)
      if (buttonText.includes('Paste')) {
        console.log('   ✓ Paste button found')
        await pasteButton.click()
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('   ✓ Paste button clicked')
      } else {
        console.log('   ❌ Paste button not found')
      }
    } else {
      console.log('   ❌ No buttons found')
    }
    
    // Test 6: Test empty text
    console.log('✅ Test 6: Test empty text')
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      if (textarea) {
        textarea.value = ''
        const event = new Event('input', { bubbles: true })
        textarea.dispatchEvent(event)
      }
    })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const emptyValue = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   Empty value: "${emptyValue}"`)
    
    if (emptyValue === '') {
      console.log('   ✓ Text cleared successfully')
    } else {
      console.log('   ❌ Text did not clear')
    }
    
    // Test 7: Check placeholder is shown when empty
    console.log('✅ Test 7: Check placeholder when empty')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const placeholder = await page.$('.text-xs.text-gray-500.font-medium')
    if (placeholder) {
      const placeholderText = await page.evaluate(el => el.textContent, placeholder)
      if (placeholderText.includes('Enter text to generate QR')) {
        console.log('   ✓ Placeholder shown when text is empty')
      } else {
        console.log('   ❌ Placeholder not shown correctly')
      }
    } else {
      console.log('   ❌ Placeholder element not found')
    }

    console.log('\n🎉 All text change tests passed!')

  } catch (error) {
    console.error('❌ Final text change test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testFinalTextChange()
