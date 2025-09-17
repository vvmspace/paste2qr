import puppeteer from 'puppeteer'

async function testPublishURL() {
  let browser
  try {
    console.log('🔗 Testing Publish URL Generation...')

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
    
    // Test 1: Type custom text and open modal
    console.log('\n✅ Test 1: Opening Publish Modal')
    const textarea = await page.$('textarea')
    if (textarea) {
      await textarea.click()
      await page.keyboard.type('Test QR Code for URL Generation')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const publishButton = await page.evaluateHandle(() => 
        Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Publish'))
      )
      const publishButtonExists = await publishButton.evaluate(el => el !== null)
      if (publishButtonExists) {
        await publishButton.click()
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('   Modal opened successfully')
      }
    }
    
    // Test 2: Fill form and publish
    console.log('\n✅ Test 2: Filling Form and Publishing')
    const titleInput = await page.$('input[placeholder*="page title"]')
    if (titleInput) {
      await titleInput.click()
      await page.keyboard.type('Test QR Code')
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    const publishFormButton = await page.evaluateHandle(() => 
      Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Publish') && btn.className.includes('bg-green'))
    )
    const publishFormButtonExists = await publishFormButton.evaluate(el => el !== null)
    if (publishFormButtonExists) {
      await publishFormButton.click()
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log('   Form submitted successfully')
    }
    
    // Test 3: Check generated URL
    console.log('\n✅ Test 3: Check Generated URL')
    const urlElement = await page.$('.bg-gray-50.rounded-lg p.font-mono')
    if (urlElement) {
      const generatedUrl = await urlElement.evaluate(el => el.textContent)
      console.log(`   Generated URL: ${generatedUrl}`)
      
      // Check if URL has correct format
      const hasCorrectFormat = generatedUrl.includes('/qr/') && !generatedUrl.includes('/p/')
      console.log(`   Correct URL format (/qr/ instead of /p/): ${hasCorrectFormat ? '✓' : '❌'}`)
      
      // Extract alias from URL
      const aliasMatch = generatedUrl.match(/\/qr\/([^\/]+)$/)
      if (aliasMatch) {
        const alias = aliasMatch[1]
        console.log(`   Extracted alias: ${alias}`)
        
        // Test 4: Verify URL is accessible
        console.log('\n✅ Test 4: Verify URL Accessibility')
        const response = await page.goto(generatedUrl, { waitUntil: 'networkidle0' })
        const status = response?.status()
        console.log(`   URL status: ${status}`)
        
        if (status === 200) {
          const pageTitle = await page.title()
          console.log(`   Page title: ${pageTitle}`)
          console.log(`   URL accessible: ✓`)
        } else {
          console.log(`   URL accessible: ❌`)
        }
      } else {
        console.log(`   Could not extract alias from URL: ❌`)
      }
    } else {
      console.log('   URL element not found: ❌')
    }
    
    // Test 5: Test old URL format (should not work)
    console.log('\n✅ Test 5: Test Old URL Format')
    const testOldUrl = 'http://localhost:3000/p/test'
    const oldResponse = await page.goto(testOldUrl, { waitUntil: 'networkidle0' })
    const oldStatus = oldResponse?.status()
    console.log(`   Old URL status: ${oldStatus}`)
    console.log(`   Old URL format blocked: ${oldStatus === 404 ? '✓' : '❌'}`)
    
    console.log('\n🎉 All URL tests completed!')

  } catch (error) {
    console.error('❌ URL test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testPublishURL()
