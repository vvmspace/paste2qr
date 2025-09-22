#!/usr/bin/env node

/**
 * Navigation height test script
 * Tests the actual height of the navigation header
 */

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function testNavigationHeight() {
  console.log('🔧 Testing navigation height...')
  
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
    
    // Get navigation height
    const navHeight = await page.evaluate(() => {
      const nav = document.querySelector('header')
      if (nav) {
        const rect = nav.getBoundingClientRect()
        return {
          height: rect.height,
          top: rect.top,
          bottom: rect.bottom,
          computedStyle: window.getComputedStyle(nav).height
        }
      }
      return null
    })
    
    console.log('📏 Navigation height info:', navHeight)
    
    // Get content position
    const contentPosition = await page.evaluate(() => {
      const content = document.querySelector('.pt-20')
      if (content) {
        const rect = content.getBoundingClientRect()
        const computedStyle = window.getComputedStyle(content)
        
        // Check first child element position (actual content)
        const firstChild = content.firstElementChild
        let firstChildTop = null
        if (firstChild) {
          const childRect = firstChild.getBoundingClientRect()
          firstChildTop = childRect.top
        }
        
        return {
          top: rect.top,
          height: rect.height,
          paddingTop: computedStyle.paddingTop,
          marginTop: computedStyle.marginTop,
          parentElement: content.parentElement?.tagName,
          className: content.className,
          firstChildTop: firstChildTop
        }
      }
      return null
    })
    
    console.log('📏 Content position info:', contentPosition)
    
    // Check if content is properly positioned below navigation
    if (navHeight && contentPosition) {
      // Content top should be at least 72px (navigation height) from top
      const expectedTop = 72
      const actualTop = contentPosition.firstChildTop || contentPosition.top
      const gap = actualTop - expectedTop
      
      console.log(`📐 Expected content top: ${expectedTop}px`)
      console.log(`📐 Actual content top: ${actualTop}px`)
      console.log(`📐 Gap: ${gap}px`)
      
      if (actualTop < expectedTop) {
        console.log('⚠️ Content is overlapping with navigation!')
      } else if (gap > 20) {
        console.log('⚠️ Too much gap between navigation and content!')
      } else {
        console.log('✅ Content is properly positioned below navigation')
      }
    }
    
    console.log('\n🎉 Navigation height test completed!')
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

testNavigationHeight().catch(console.error)
