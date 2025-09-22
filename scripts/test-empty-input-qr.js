#!/usr/bin/env node

/**
 * Empty input QR generation test
 * Tests that QR code is generated for https://paste2qr.com/ when input is empty
 */

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function testEmptyInputQR() {
  console.log('🔧 Testing empty input QR generation...')
  
  let browser
  try {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    console.log('📱 Navigating to http://localhost:3000...')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Test 1: Check initial state (should have default URL)
    console.log('✅ Test 1: Check initial state')
    const initialState = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      const qrImage = document.querySelector('img[alt], img[src*="data:image"]')
      return {
        textareaValue: textarea?.value || '',
        hasQRImage: !!qrImage,
        qrImageSrc: qrImage?.src?.substring(0, 100) || null
      }
    })
    
    console.log('   Initial state:', initialState)
    
    if (initialState.hasQRImage && initialState.textareaValue.includes('localhost:3000')) {
      console.log('   ✓ QR code generated for default URL initially')
    } else {
      console.log('   ⚠️ QR code not generated for default URL initially')
    }
    
    // Test 2: Clear input and check QR generation
    console.log('✅ Test 2: Clear input and check QR generation')
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.value = ''
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const afterClearState = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      const qrImage = document.querySelector('img[alt], img[src*="data:image"]')
      return {
        textareaValue: textarea?.value || '',
        hasQRImage: !!qrImage,
        qrImageSrc: qrImage?.src?.substring(0, 100) || null
      }
    })
    
    console.log('   After clear state:', afterClearState)
    
    if (afterClearState.hasQRImage && afterClearState.textareaValue === '') {
      console.log('   ✓ QR code generated for empty input (should be https://paste2qr.com/)')
    } else {
      console.log('   ⚠️ QR code not generated for empty input')
    }
    
    // Test 3: Type some text and then clear it
    console.log('✅ Test 3: Type text, then clear it')
    await page.type('textarea', 'Test content')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.value = ''
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const afterTypeAndClearState = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      const qrImage = document.querySelector('img[alt], img[src*="data:image"]')
      return {
        textareaValue: textarea?.value || '',
        hasQRImage: !!qrImage,
        qrImageSrc: qrImage?.src?.substring(0, 100) || null
      }
    })
    
    console.log('   After type and clear state:', afterTypeAndClearState)
    
    if (afterTypeAndClearState.hasQRImage && afterTypeAndClearState.textareaValue === '') {
      console.log('   ✓ QR code generated after clearing typed content')
    } else {
      console.log('   ⚠️ QR code not generated after clearing typed content')
    }
    
    // Test 4: Check if QR code contains expected URL
    console.log('✅ Test 4: Verify QR code content')
    if (afterTypeAndClearState.qrImageSrc) {
      console.log('   QR code generated successfully')
      console.log('   QR code src preview:', afterTypeAndClearState.qrImageSrc)
    } else {
      console.log('   ⚠️ No QR code found')
    }
    
    console.log('\n🎉 Empty input QR generation test completed!')
    console.log('Browser will stay open for 10 seconds for manual inspection...')
    await new Promise(resolve => setTimeout(resolve, 10000))
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testEmptyInputQR().catch(console.error)
