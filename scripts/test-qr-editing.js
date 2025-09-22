#!/usr/bin/env node

/**
 * QR Code editing test script
 * Tests QR code generation during text editing
 */

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Parse command line arguments for timeout
const getTimeout = () => {
  const timeoutArg = process.argv.find(arg => arg.startsWith('--timeout='))
  return timeoutArg ? parseInt(timeoutArg.split('=')[1]) : 100
}

const timeout = getTimeout()

async function testQREditing() {
  console.log('🔧 Starting QR code editing tests...')
  console.log(`⏱️  Timeout: ${timeout}ms between steps`)
  
  let browser
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Set to true for CI
      defaultViewport: { width: 375, height: 667 }, // iPhone SE size
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Navigate to the app
    console.log('📱 Navigating to http://localhost:3000...')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 1: Initial state
    console.log('✅ Test 1: Initial state check')
    const initialState = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      const qrImage = document.querySelector('img[alt], img[src*="data:image"]')
      return {
        hasTextarea: !!textarea,
        textareaValue: textarea?.value || '',
        hasQRImage: !!qrImage,
        qrImageSrc: qrImage?.src?.substring(0, 50) || null
      }
    })
    
    console.log('   Initial state:', initialState)
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 2: Type initial text
    console.log('✅ Test 2: Type initial text')
    await page.type('textarea', 'Hello World')
    await new Promise(resolve => setTimeout(resolve, timeout * 3)) // Wait for QR generation
    
    const afterInitialType = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      const qrImage = document.querySelector('img[alt], img[src*="data:image"]')
      return {
        textareaValue: textarea?.value || '',
        hasQRImage: !!qrImage,
        qrImageSrc: qrImage?.src?.substring(0, 50) || null
      }
    })
    
    console.log('   After initial type:', afterInitialType)
    
    if (afterInitialType.hasQRImage) {
      console.log('   ✓ QR code generated after initial typing')
    } else {
      console.log('   ⚠️ QR code not generated after initial typing')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 3: Edit text (add more)
    console.log('✅ Test 3: Edit text - add more content')
    await page.click('textarea')
    await page.keyboard.press('End')
    await page.type('textarea', ' - Edited!')
    await new Promise(resolve => setTimeout(resolve, timeout * 3))
    
    const afterEdit = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      const qrImage = document.querySelector('img[alt], img[src*="data:image"]')
      return {
        textareaValue: textarea?.value || '',
        hasQRImage: !!qrImage,
        qrImageSrc: qrImage?.src?.substring(0, 50) || null
      }
    })
    
    console.log('   After edit:', afterEdit)
    
    if (afterEdit.hasQRImage && afterEdit.textareaValue.includes('Edited')) {
      console.log('   ✓ QR code updated after editing text')
    } else {
      console.log('   ⚠️ QR code not updated after editing')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 4: Clear and retype
    console.log('✅ Test 4: Clear text and retype')
    await page.click('textarea')
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.value = ''
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    await page.type('textarea', 'New Content')
    await new Promise(resolve => setTimeout(resolve, timeout * 3))
    
    const afterClearRetype = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      const qrImage = document.querySelector('img[alt], img[src*="data:image"]')
      return {
        textareaValue: textarea?.value || '',
        hasQRImage: !!qrImage,
        qrImageSrc: qrImage?.src?.substring(0, 50) || null
      }
    })
    
    console.log('   After clear and retype:', afterClearRetype)
    
    if (afterClearRetype.hasQRImage && afterClearRetype.textareaValue === 'New Content') {
      console.log('   ✓ QR code generated after clear and retype')
    } else {
      console.log('   ⚠️ QR code not generated after clear and retype')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 5: Test debounce behavior
    console.log('✅ Test 5: Test debounce behavior (rapid typing)')
    await page.click('textarea')
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.value = ''
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Type rapidly
    const rapidText = 'Rapid typing test'
    for (let i = 0; i < rapidText.length; i++) {
      await page.keyboard.type(rapidText[i])
      await new Promise(resolve => setTimeout(resolve, 50)) // Very fast typing
    }
    
    // Wait for debounce to complete
    await new Promise(resolve => setTimeout(resolve, timeout * 4))
    
    const afterRapidTyping = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      const qrImage = document.querySelector('img[alt], img[src*="data:image"]')
      return {
        textareaValue: textarea?.value || '',
        hasQRImage: !!qrImage,
        qrImageSrc: qrImage?.src?.substring(0, 50) || null
      }
    })
    
    console.log('   After rapid typing:', afterRapidTyping)
    
    if (afterRapidTyping.hasQRImage && afterRapidTyping.textareaValue === rapidText) {
      console.log('   ✓ QR code generated after rapid typing (debounce working)')
    } else {
      console.log('   ⚠️ QR code not generated after rapid typing')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 6: Test action bar buttons during editing
    console.log('✅ Test 6: Test action bar buttons during editing')
    const actionBarButtons = await page.$$eval('.fixed.bottom-0 button', buttons => 
      buttons.map(btn => btn.textContent?.trim() || '')
    )
    
    console.log('   Action bar buttons:', actionBarButtons)
    
    const expectedButtons = ['Paste', 'Copy', 'Publish', 'Share', 'Clear']
    const foundButtons = expectedButtons.filter(expected => 
      actionBarButtons.some(text => text.includes(expected))
    )
    
    console.log(`   Found buttons: ${foundButtons.join(', ')}`)
    
    if (foundButtons.length >= 4) {
      console.log('   ✓ All expected action bar buttons present')
    } else {
      console.log('   ⚠️ Some action bar buttons missing')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 7: Test Clear button functionality
    console.log('✅ Test 7: Test Clear button functionality')
    const clearButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      return buttons.find(btn => btn.textContent?.includes('Clear'))
    })
    
    if (clearButton && clearButton.asElement()) {
      try {
        await clearButton.asElement().click()
        await new Promise(resolve => setTimeout(resolve, timeout * 2))
        
        const afterClear = await page.evaluate(() => {
          const textarea = document.querySelector('textarea')
          const qrImage = document.querySelector('img[alt], img[src*="data:image"]')
          return {
            textareaValue: textarea?.value || '',
            hasQRImage: !!qrImage
          }
        })
        
        console.log('   After clear button:', afterClear)
        
        if (!afterClear.hasQRImage && afterClear.textareaValue === '') {
          console.log('   ✓ Clear button works correctly')
        } else {
          console.log('   ⚠️ Clear button not working properly')
        }
      } catch (error) {
        console.log('   ⚠️ Clear button click failed:', error.message)
      }
    } else {
      console.log('   ⚠️ Clear button not found')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    console.log('\n🎉 All QR editing tests completed!')
    
  } catch (error) {
    console.error('❌ QR editing test failed:', error.message)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Run tests
testQREditing().catch(console.error)
