#!/usr/bin/env node

/**
 * Simple action buttons test - manual verification
 */

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function testSimpleActionButtons() {
  console.log('🔧 Starting simple action buttons test...')
  
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
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check initial state
    console.log('✅ Initial state check')
    const initialButtons = await page.$$eval('.fixed.bottom-0 button', buttons => 
      buttons.map(btn => btn.textContent?.trim() || '')
    )
    console.log('   Initial buttons:', initialButtons)
    
    // Type some text
    console.log('✅ Typing text...')
    await page.type('textarea', 'Hello World')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const afterTypingButtons = await page.$$eval('.fixed.bottom-0 button', buttons => 
      buttons.map(btn => btn.textContent?.trim() || '')
    )
    console.log('   After typing buttons:', afterTypingButtons)
    
    // Clear text manually
    console.log('✅ Clearing text manually...')
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.value = ''
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const afterClearButtons = await page.$$eval('.fixed.bottom-0 button', buttons => 
      buttons.map(btn => btn.textContent?.trim() || '')
    )
    console.log('   After clear buttons:', afterClearButtons)
    
    // Check if textarea is actually empty
    const textareaValue = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      return textarea?.value || ''
    })
    console.log('   Textarea value after clear:', textareaValue)
    
    console.log('\n🎉 Simple test completed!')
    console.log('Please check the browser window to verify button behavior manually.')
    
    // Keep browser open for manual inspection
    console.log('Browser will stay open for 30 seconds for manual inspection...')
    await new Promise(resolve => setTimeout(resolve, 30000))
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testSimpleActionButtons().catch(console.error)
