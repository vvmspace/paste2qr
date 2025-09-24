import puppeteer from 'puppeteer'

async function testContactQRPage() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 } // iPhone SE size
  })
  
  try {
    const page = await browser.newPage()
    
    console.log('🧪 Testing Contact QR Code Page...')
    
    // Test 1: Load the contact QR page
    console.log('\n📱 Test 1: Loading contact-info-qr-code page...')
    await page.goto('http://localhost:3000/contact-info-qr-code', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    })
    
    // Check if page loads successfully
    const title = await page.title()
    console.log(`✅ Page loaded successfully. Title: "${title}"`)
    
    // Test 2: Check if QR generator is present
    console.log('\n🔍 Test 2: Checking QR generator presence...')
    const qrGenerator = await page.$('textarea')
    if (qrGenerator) {
      console.log('✅ QR generator textarea found')
    } else {
      console.log('❌ QR generator textarea not found')
    }
    
    // Test 3: Check if Paste button is present
    console.log('\n📋 Test 3: Checking Paste button...')
    const pasteButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      return buttons.find(btn => btn.textContent?.includes('Paste'))
    })
    
    if (pasteButton && await pasteButton.asElement()) {
      console.log('✅ Paste button found')
    } else {
      console.log('❌ Paste button not found')
    }
    
    // Test 4: Test contact information input
    console.log('\n📝 Test 4: Testing contact information input...')
    
    // Sample vCard data
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:John Doe
ORG:Example Company
TEL:+1234567890
EMAIL:john@example.com
URL:https://example.com
END:VCARD`
    
    // Clear textarea and input vCard data
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.value = ''
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    
    await page.type('textarea', vCardData)
    console.log('✅ vCard data entered')
    
    // Wait for QR code generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Test 5: Check if QR code was generated
    console.log('\n🔲 Test 5: Checking QR code generation...')
    const qrCode = await page.$('img[alt*="QR"], img[alt*="qr"]')
    if (qrCode) {
      console.log('✅ QR code generated successfully')
      
      // Get QR code src to verify it's not empty
      const qrSrc = await page.evaluate(img => img.src, qrCode)
      if (qrSrc && qrSrc.startsWith('data:image')) {
        console.log('✅ QR code has valid data URL')
      } else {
        console.log('❌ QR code data URL is invalid')
      }
    } else {
      console.log('❌ QR code not generated')
    }
    
    // Test 6: Check action buttons visibility
    console.log('\n🔘 Test 6: Checking action buttons...')
    const actionButtons = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      return buttons.filter(btn => 
        btn.textContent?.includes('Copy') || 
        btn.textContent?.includes('Share') || 
        btn.textContent?.includes('Publish') ||
        btn.textContent?.includes('Clear')
      )
    })
    
    console.log(`✅ Found ${actionButtons?.length || 0} action buttons`)
    
    // Test 7: Test Copy functionality
    console.log('\n📋 Test 7: Testing Copy functionality...')
    const copyButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      return buttons.find(btn => btn.textContent?.includes('Copy'))
    })
    
    if (copyButton && await copyButton.asElement()) {
      await copyButton.click()
      console.log('✅ Copy button clicked')
      
      // Check if clipboard contains the vCard data
      const clipboardText = await page.evaluate(() => {
        return navigator.clipboard.readText()
      }).catch(() => 'Clipboard access denied')
      
      if (clipboardText.includes('BEGIN:VCARD')) {
        console.log('✅ vCard data copied to clipboard')
      } else {
        console.log('⚠️ Clipboard content verification failed (may be due to permissions)')
      }
    } else {
      console.log('❌ Copy button not found')
    }
    
    // Test 8: Check page content
    console.log('\n📄 Test 8: Checking page content...')
    const pageContent = await page.evaluate(() => {
      return {
        hasContactInfo: document.body.textContent.includes('Contact Info'),
        hasVCard: document.body.textContent.includes('vCard'),
        hasBusinessCard: document.body.textContent.includes('business card'),
        hasContactSharing: document.body.textContent.includes('contact sharing')
      }
    })
    
    console.log('Page content check:', pageContent)
    
    if (pageContent.hasContactInfo && pageContent.hasVCard) {
      console.log('✅ Page contains relevant contact QR content')
    } else {
      console.log('❌ Page missing contact QR content')
    }
    
    // Test 9: Test mobile responsiveness
    console.log('\n📱 Test 9: Testing mobile responsiveness...')
    const viewport = await page.viewport()
    console.log(`✅ Testing on viewport: ${viewport.width}x${viewport.height}`)
    
    // Check if elements are properly sized for mobile
    const textareaSize = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        const rect = textarea.getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      }
      return null
    })
    
    if (textareaSize && textareaSize.width > 0) {
      console.log(`✅ Textarea size: ${textareaSize.width}x${textareaSize.height}`)
    }
    
    console.log('\n🎉 Contact QR Code Page Test Completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await browser.close()
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const timeout = args.includes('--timeout') ? 
  parseInt(args[args.indexOf('--timeout') + 1]) || 100 : 100

// Run the test
testContactQRPage().catch(console.error)
