import puppeteer from 'puppeteer'

async function testNewButtons() {
  let browser
  try {
    console.log('🔘 Testing new buttons (Publish, Copy Text, Share)...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Navigate to the app
    console.log('📱 Navigating to http://localhost:3000...')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Test 1: Check initial button state (only Paste button should be visible)
    console.log('\n✅ Test 1: Initial button state')
    const initialButtons = await page.$$eval('button', buttons => 
      buttons.map(btn => btn.textContent?.trim()).filter(text => text)
    )
    console.log(`   Initial buttons: ${initialButtons.join(', ')}`)
    
    // Test 2: Type some text and check if Copy button appears
    console.log('\n✅ Test 2: Copy button appears when text is entered')
    const textarea = await page.$('textarea')
    if (textarea) {
      await textarea.click()
      await page.keyboard.type('Test QR Code Text')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const buttonsAfterText = await page.$$eval('button', buttons => 
        buttons.map(btn => btn.textContent?.trim()).filter(text => text)
      )
      console.log(`   Buttons after typing: ${buttonsAfterText.join(', ')}`)
      
      const hasCopyButton = buttonsAfterText.some(text => text.includes('Copy'))
      console.log(`   Copy button visible: ${hasCopyButton ? '✓' : '❌'}`)
    }
    
    // Test 3: Check if Publish button appears (should not appear for default text)
    console.log('\n✅ Test 3: Publish button visibility')
    const publishButton = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Publish'))
    )
    const hasPublishButton = await publishButton.evaluate(el => el !== null)
    console.log(`   Publish button visible (should be false for default text): ${hasPublishButton ? '❌' : '✓'}`)
    
    // Test 4: Check if Share button appears when QR code is generated
    console.log('\n✅ Test 4: Share button visibility')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait for QR generation
    
    const shareButton = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Share'))
    )
    const hasShareButton = await shareButton.evaluate(el => el !== null)
    console.log(`   Share button visible: ${hasShareButton ? '✓' : '❌'}`)
    
    // Test 5: Test Copy button functionality
    console.log('\n✅ Test 5: Copy button functionality')
    const copyButton = await page.$('[data-copy-button]')
    if (copyButton) {
      await copyButton.click()
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check if button text changed to "Copied!"
      const buttonText = await copyButton.evaluate(el => el.textContent?.trim())
      console.log(`   Copy button text after click: "${buttonText}"`)
      console.log(`   Copy feedback working: ${buttonText?.includes('Copied') ? '✓' : '❌'}`)
    } else {
      console.log('   Copy button not found')
    }
    
    // Test 6: Test Share button functionality
    console.log('\n✅ Test 6: Share button functionality')
    const shareButtonElement = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Share'))
    )
    const shareButtonExists = await shareButtonElement.evaluate(el => el !== null)
    if (shareButtonExists) {
      await shareButtonElement.click()
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('   Share button clicked successfully')
    } else {
      console.log('   Share button not found')
    }
    
    // Test 7: Test Publish button with custom text
    console.log('\n✅ Test 7: Publish button with custom text')
    if (textarea) {
      await textarea.click()
      await page.keyboard.down('Control')
      await page.keyboard.press('KeyA')
      await page.keyboard.up('Control')
      await page.keyboard.type('Custom QR Code Text')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const publishButtonElement = await page.evaluateHandle(() => 
        Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Publish'))
      )
      const publishButtonExists = await publishButtonElement.evaluate(el => el !== null)
      console.log(`   Publish button visible with custom text: ${publishButtonExists ? '✓' : '❌'}`)
      
      if (publishButtonExists) {
        await publishButtonElement.click()
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('   Publish button clicked successfully')
        
        // Check if modal opened
        const modal = await page.$('[role="dialog"], .modal, [data-modal]')
        console.log(`   Publish modal opened: ${modal ? '✓' : '❌'}`)
      }
    }
    
    // Test 8: Check button layout and styling
    console.log('\n✅ Test 8: Button layout and styling')
    const buttonContainer = await page.$('.fixed.bottom-0')
    if (buttonContainer) {
      const buttonCount = await buttonContainer.$$eval('button', buttons => buttons.length)
      console.log(`   Total buttons in fixed bar: ${buttonCount}`)
      
      const buttonStyles = await buttonContainer.$$eval('button', buttons => 
        buttons.map(btn => ({
          text: btn.textContent?.trim(),
          classes: btn.className,
          hasIcon: btn.querySelector('svg') !== null
        }))
      )
      
      buttonStyles.forEach((style, index) => {
        console.log(`   Button ${index + 1}: "${style.text}" - Icon: ${style.hasIcon ? '✓' : '❌'}`)
      })
    }
    
    console.log('\n🎉 All button tests completed!')

  } catch (error) {
    console.error('❌ Button test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testNewButtons()
