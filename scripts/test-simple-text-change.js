import puppeteer from 'puppeteer'

async function testSimpleTextChange() {
  let browser
  try {
    console.log('🔤 Testing simple text change functionality...')

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
    const initialValue = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   Initial value: "${initialValue}"`)
    
    // Test 2: Use JavaScript to directly set value
    console.log('✅ Test 2: Set value via JavaScript')
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      if (textarea) {
        // Set value directly
        textarea.value = 'Hello World Test'
        
        // Trigger change event
        const event = new Event('input', { bubbles: true })
        textarea.dispatchEvent(event)
      }
    })
    
    // Wait for React to update
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if value changed
    const newValue = await page.evaluate(() => {
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      return textarea ? textarea.value : null
    })
    console.log(`   New value: "${newValue}"`)
    
    if (newValue === 'Hello World Test') {
      console.log('   ✓ Text changed successfully via JavaScript')
    } else {
      console.log('   ❌ Text did not change via JavaScript')
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
    
    // Test 4: Try another value change
    console.log('✅ Test 4: Change to another value')
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
      console.log('   ✓ Text changed to final value successfully')
    } else {
      console.log('   ❌ Text did not change to final value')
    }
    
    // Test 5: Check React state
    console.log('✅ Test 5: Check React component state')
    const componentState = await page.evaluate(() => {
      // Try to access React DevTools or component state
      const textarea = document.querySelector('textarea[placeholder*="Paste any text"]')
      if (textarea) {
        return {
          value: textarea.value,
          placeholder: textarea.placeholder,
          className: textarea.className
        }
      }
      return null
    })
    console.log('   Component state:', componentState)
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will stay open for 15 seconds for manual inspection...')
    await new Promise(resolve => setTimeout(resolve, 15000))

    console.log('\n🎉 Simple text change test completed!')

  } catch (error) {
    console.error('❌ Simple text change test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testSimpleTextChange()
