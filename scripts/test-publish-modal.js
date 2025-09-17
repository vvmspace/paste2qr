import puppeteer from 'puppeteer'

async function testPublishModal() {
  let browser
  try {
    console.log('📱 Testing Publish Modal (fullscreen with close button)...')

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
    
    // Test 1: Type custom text to make Publish button visible
    console.log('\n✅ Test 1: Making Publish button visible')
    const textarea = await page.$('textarea')
    if (textarea) {
      await textarea.click()
      await page.keyboard.type('Custom QR Code Text for Publishing')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const publishButton = await page.evaluateHandle(() => 
        Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Publish'))
      )
      const publishButtonExists = await publishButton.evaluate(el => el !== null)
      console.log(`   Publish button visible: ${publishButtonExists ? '✓' : '❌'}`)
      
      if (publishButtonExists) {
        await publishButton.click()
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('   Publish button clicked successfully')
      }
    }
    
    // Test 2: Check if modal opened in fullscreen
    console.log('\n✅ Test 2: Check fullscreen modal')
    const modal = await page.$('.fixed.inset-0.bg-white.z-50')
    const modalExists = await modal?.evaluate(el => el !== null)
    console.log(`   Fullscreen modal opened: ${modalExists ? '✓' : '❌'}`)
    
    // Test 3: Check modal header with close button
    console.log('\n✅ Test 3: Check modal header')
    const header = await page.$('.flex.items-center.justify-between.p-4.border-b')
    const headerExists = await header?.evaluate(el => el !== null)
    console.log(`   Modal header exists: ${headerExists ? '✓' : '❌'}`)
    
    const closeButton = await page.$('button svg path[d*="M6 18L18 6"]')
    const closeButtonExists = await closeButton?.evaluate(el => el !== null)
    console.log(`   Close button (X) exists: ${closeButtonExists ? '✓' : '❌'}`)
    
    // Test 4: Check form fields
    console.log('\n✅ Test 4: Check form fields')
    const titleInput = await page.$('input[placeholder*="page title"]')
    const titleInputExists = await titleInput?.evaluate(el => el !== null)
    console.log(`   Title input field: ${titleInputExists ? '✓' : '❌'}`)
    
    const descriptionTextarea = await page.$('textarea[placeholder*="description"]')
    const descriptionExists = await descriptionTextarea?.evaluate(el => el !== null)
    console.log(`   Description textarea: ${descriptionExists ? '✓' : '❌'}`)
    
    const languageSelect = await page.$('select')
    const languageSelectExists = await languageSelect?.evaluate(el => el !== null)
    console.log(`   Language select: ${languageSelectExists ? '✓' : '❌'}`)
    
    // Test 5: Check form buttons
    console.log('\n✅ Test 5: Check form buttons')
    const publishSubmitButton = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Publish QR Code'))
    )
    const publishSubmitExists = await publishSubmitButton.evaluate(el => el !== null)
    console.log(`   Publish submit button: ${publishSubmitExists ? '✓' : '❌'}`)
    
    const cancelButton = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Cancel'))
    )
    const cancelButtonExists = await cancelButton.evaluate(el => el !== null)
    console.log(`   Cancel button: ${cancelButtonExists ? '✓' : '❌'}`)
    
    // Test 6: Test close button functionality
    console.log('\n✅ Test 6: Test close button functionality')
    if (closeButtonExists) {
      const closeButtonElement = await page.$('button svg path[d*="M6 18L18 6"]')
      await closeButtonElement.click()
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const modalAfterClose = await page.$('.fixed.inset-0.bg-white.z-50')
      const modalStillExists = await modalAfterClose?.evaluate(el => el !== null)
      console.log(`   Modal closed successfully: ${!modalStillExists ? '✓' : '❌'}`)
    }
    
    // Test 7: Test form interaction
    console.log('\n✅ Test 7: Test form interaction')
    // Reopen modal
    const publishButton2 = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Publish'))
    )
    const publishButton2Exists = await publishButton2.evaluate(el => el !== null)
    if (publishButton2Exists) {
      await publishButton2.click()
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Fill form
      const titleInput2 = await page.$('input[placeholder*="page title"]')
      if (titleInput2) {
        await titleInput2.click()
        await page.keyboard.type('Test Page Title')
        console.log('   Title field filled')
      }
      
      const descriptionTextarea2 = await page.$('textarea[placeholder*="description"]')
      if (descriptionTextarea2) {
        await descriptionTextarea2.click()
        await page.keyboard.type('Test description for the QR code page')
        console.log('   Description field filled')
      }
      
      console.log('   Form interaction completed')
    }
    
    // Test 8: Check modal styling
    console.log('\n✅ Test 8: Check modal styling')
    const modalStyles = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0.bg-white.z-50')
      if (!modal) return null
      
      const styles = window.getComputedStyle(modal)
      return {
        position: styles.position,
        top: styles.top,
        left: styles.left,
        right: styles.right,
        bottom: styles.bottom,
        backgroundColor: styles.backgroundColor,
        zIndex: styles.zIndex
      }
    })
    
    if (modalStyles) {
      console.log(`   Modal position: ${modalStyles.position}`)
      console.log(`   Modal covers full screen: ${modalStyles.top === '0px' && modalStyles.left === '0px' ? '✓' : '❌'}`)
      console.log(`   Modal background: ${modalStyles.backgroundColor}`)
      console.log(`   Modal z-index: ${modalStyles.zIndex}`)
    }
    
    console.log('\n🎉 All publish modal tests completed!')

  } catch (error) {
    console.error('❌ Publish modal test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testPublishModal()
