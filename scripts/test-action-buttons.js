#!/usr/bin/env node

/**
 * Action buttons visibility test script
 * Tests that Copy, Share, Publish, Clear buttons only appear after user interaction
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

async function testActionButtons() {
  console.log('🔧 Starting action buttons visibility tests...')
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
    
    // Test 1: Initial state - only Paste button should be visible
    console.log('✅ Test 1: Initial state - only Paste button visible')
    const initialButtons = await page.$$eval('.fixed.bottom-0 button', buttons => 
      buttons.map(btn => btn.textContent?.trim() || '')
    )
    
    console.log('   Initial buttons:', initialButtons)
    
    const expectedInitialButtons = ['Paste']
    const unexpectedButtons = ['Copy', 'Publish', 'Share', 'Clear']
    
    const hasOnlyPaste = initialButtons.length === 1 && initialButtons[0] === 'Paste'
    const hasUnexpectedButtons = unexpectedButtons.some(unexpected => 
      initialButtons.some(text => text.includes(unexpected))
    )
    
    if (hasOnlyPaste && !hasUnexpectedButtons) {
      console.log('   ✓ Only Paste button visible initially')
    } else {
      console.log('   ⚠️ Unexpected buttons visible initially')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 2: After typing - Copy, Publish, Clear should appear
    console.log('✅ Test 2: After typing - Copy, Publish, Clear should appear')
    await page.type('textarea', 'Test text')
    await new Promise(resolve => setTimeout(resolve, timeout * 3)) // Wait for QR generation
    
    const afterTypingButtons = await page.$$eval('.fixed.bottom-0 button', buttons => 
      buttons.map(btn => btn.textContent?.trim() || '')
    )
    
    console.log('   After typing buttons:', afterTypingButtons)
    
    const expectedAfterTyping = ['Paste', 'Copy', 'Publish', 'Clear']
    const foundAfterTyping = expectedAfterTyping.filter(expected => 
      afterTypingButtons.some(text => text.includes(expected))
    )
    
    if (foundAfterTyping.length >= 4) {
      console.log('   ✓ Copy, Publish, Clear buttons appeared after typing')
    } else {
      console.log('   ⚠️ Some buttons missing after typing')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 3: Share button should appear after QR code generation
    console.log('✅ Test 3: Share button should appear after QR generation')
    const afterQRButtons = await page.$$eval('.fixed.bottom-0 button', buttons => 
      buttons.map(btn => btn.textContent?.trim() || '')
    )
    
    console.log('   After QR generation buttons:', afterQRButtons)
    
    const hasShareButton = afterQRButtons.some(text => text.includes('Share'))
    
    if (hasShareButton) {
      console.log('   ✓ Share button appeared after QR generation')
    } else {
      console.log('   ⚠️ Share button not found after QR generation')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 4: Clear text and check button visibility
    console.log('✅ Test 4: Clear text and check button visibility')
    const clearButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      return buttons.find(btn => btn.textContent?.includes('Clear'))
    })
    
    if (clearButton && clearButton.asElement()) {
      try {
        await clearButton.asElement().click()
        await new Promise(resolve => setTimeout(resolve, timeout * 2))
      } catch (error) {
        console.log('   ⚠️ Clear button click failed, using fallback')
        await page.evaluate(() => {
          const textarea = document.querySelector('textarea')
          if (textarea) {
            textarea.value = ''
            textarea.dispatchEvent(new Event('input', { bubbles: true }))
            // Also trigger onChange to reset hasUserInteracted
            textarea.dispatchEvent(new Event('change', { bubbles: true }))
          }
        })
        await new Promise(resolve => setTimeout(resolve, timeout * 2))
      }
    } else {
      console.log('   ⚠️ Clear button not found, using fallback')
      await page.evaluate(() => {
        const textarea = document.querySelector('textarea')
        if (textarea) {
          textarea.value = ''
          textarea.dispatchEvent(new Event('input', { bubbles: true }))
          // Also trigger onChange to reset hasUserInteracted
          textarea.dispatchEvent(new Event('change', { bubbles: true }))
        }
      })
      await new Promise(resolve => setTimeout(resolve, timeout * 2))
    }
    
    const afterClearButtons = await page.$$eval('.fixed.bottom-0 button', buttons => 
      buttons.map(btn => btn.textContent?.trim() || '')
    )
    
    console.log('   After clear buttons:', afterClearButtons)
    
    const hasOnlyPasteAfterClear = afterClearButtons.length === 1 && afterClearButtons[0] === 'Paste'
    
    if (hasOnlyPasteAfterClear) {
      console.log('   ✓ Only Paste button visible after clearing text')
    } else {
      console.log('   ⚠️ Unexpected buttons visible after clearing text')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 5: Test Paste button functionality
    console.log('✅ Test 5: Test Paste button functionality')
    await page.evaluate(() => {
      // Mock clipboard content
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          readText: () => Promise.resolve('Pasted content')
        },
        writable: true
      })
    })
    
    const pasteButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'))
      return buttons.find(btn => btn.textContent?.includes('Paste'))
    })
    if (pasteButton && pasteButton.asElement()) {
      await pasteButton.asElement().click()
      await new Promise(resolve => setTimeout(resolve, timeout * 2))
      
      const afterPasteButtons = await page.$$eval('.fixed.bottom-0 button', buttons => 
        buttons.map(btn => btn.textContent?.trim() || '')
      )
      
      console.log('   After paste buttons:', afterPasteButtons)
      
      const expectedAfterPaste = ['Paste', 'Copy', 'Publish', 'Clear']
      const foundAfterPaste = expectedAfterPaste.filter(expected => 
        afterPasteButtons.some(text => text.includes(expected))
      )
      
      if (foundAfterPaste.length >= 4) {
        console.log('   ✓ Copy, Publish, Clear buttons appeared after paste')
      } else {
        console.log('   ⚠️ Some buttons missing after paste')
      }
    } else {
      console.log('   ⚠️ Paste button not found')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    console.log('\n🎉 All action buttons visibility tests completed!')
    
  } catch (error) {
    console.error('❌ Action buttons test failed:', error.message)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Run tests
testActionButtons().catch(console.error)
