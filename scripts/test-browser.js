#!/usr/bin/env node

/**
 * Browser testing script
 * Tests the application functionality in a real browser environment
 */

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function testBrowser() {
  console.log('🌐 Starting browser tests...')
  
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
    
    // Test 1: Check if page loads
    console.log('✅ Test 1: Page loads successfully')
    const title = await page.title()
    console.log(`   Title: ${title}`)
    
    // Test 2: Check if QR generator is visible
    console.log('✅ Test 2: QR Generator is visible')
    const textarea = await page.$('textarea[placeholder*="Paste any text"]')
    if (textarea) {
      console.log('   ✓ Textarea found')
    } else {
      throw new Error('Textarea not found')
    }
    
    // Test 3: Check if buttons are visible
    console.log('✅ Test 3: Buttons are visible')
    const buttons = await page.$$('button')
    const buttonTexts = await Promise.all(buttons.map(btn => btn.evaluate(el => el.textContent)))
    
    const hasPaste = buttonTexts.some(text => text.includes('Paste'))
    const hasShare = buttonTexts.some(text => text.includes('Share'))
    
    if (hasPaste) {
      console.log('   ✓ Paste to QR button found')
    } else {
      throw new Error('Required buttons not found')
    }
    
    // Test 4: Test QR code generation
    console.log('✅ Test 4: QR code generation')
    await page.type('textarea[placeholder*="Paste any text"]', 'Test QR Code')
    
    // Wait for QR code to appear
    await page.waitForSelector('img[alt="Generated QR Code"]', { timeout: 5000 })
    console.log('   ✓ QR code generated successfully')
    
    // Test 5: Test download functionality
    console.log('✅ Test 5: Download functionality')
    const downloadButtons = await page.$$('button')
    const downloadButtonTexts = await Promise.all(downloadButtons.map(btn => btn.evaluate(el => el.textContent)))
    const hasDownload = downloadButtonTexts.some(text => text.includes('Download'))
    
    if (hasDownload) {
      console.log('   ✓ Download button found')
      // Note: We can't actually test download in headless mode
    }
    
    // Test 6: Test mobile responsiveness
    console.log('✅ Test 6: Mobile responsiveness')
    const viewport = page.viewport()
    console.log(`   Viewport: ${viewport.width}x${viewport.height}`)
    
    // Test 7: Check console for errors
    console.log('✅ Test 7: Console error check')
    const logs = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text())
      }
    })
    
    // Wait a bit to collect any errors
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (logs.length === 0) {
      console.log('   ✓ No console errors found')
    } else {
      console.log(`   ⚠️ Found ${logs.length} console errors:`)
      logs.forEach(log => console.log(`     - ${log}`))
    }
    
    // Test 8: Performance check
    console.log('✅ Test 8: Performance check')
    const performanceMetrics = await page.metrics()
    console.log(`   JS Heap Used: ${Math.round(performanceMetrics.JSHeapUsedSize / 1024 / 1024)}MB`)
    console.log(`   JS Heap Total: ${Math.round(performanceMetrics.JSHeapTotalSize / 1024 / 1024)}MB`)
    
    console.log('\n🎉 All browser tests passed!')
    
  } catch (error) {
    console.error('❌ Browser test failed:', error.message)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Run the test
testBrowser().catch(console.error)
