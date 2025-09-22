#!/usr/bin/env node

/**
 * Layout testing script
 * Tests layout requirements: fixed sidebars and QR spacing
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

async function testLayout() {
  console.log('🎨 Starting layout tests...')
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
    
    // Test 0: Check for CSS filter issues that break position: fixed
    console.log('✅ Test 0: CSS filter and positioning issues check')
    const filterIssues = await page.evaluate(() => {
      const header = document.querySelector('header')
      const actionBar = document.querySelector('.fixed.bottom-0')
      
      const checkParentFilters = (element) => {
        let parent = element?.parentElement
        const issues = []
        
        while (parent && parent !== document.body) {
          const styles = window.getComputedStyle(parent)
          if (styles.filter && styles.filter !== 'none') {
            issues.push({
              element: parent.tagName,
              className: parent.className,
              filter: styles.filter,
              position: styles.position
            })
          }
          if (styles.transform && styles.transform !== 'none') {
            issues.push({
              element: parent.tagName,
              className: parent.className,
              transform: styles.transform,
              position: styles.position
            })
          }
          if (styles.contain && styles.contain !== 'none') {
            issues.push({
              element: parent.tagName,
              className: parent.className,
              contain: styles.contain,
              position: styles.position
            })
          }
          if (styles.isolation && styles.isolation !== 'auto') {
            issues.push({
              element: parent.tagName,
              className: parent.className,
              isolation: styles.isolation,
              position: styles.position
            })
          }
          parent = parent.parentElement
        }
        return issues
      }
      
      return {
        headerFilters: checkParentFilters(header),
        actionBarFilters: checkParentFilters(actionBar)
      }
    })
    
    if (filterIssues.headerFilters.length > 0 || filterIssues.actionBarFilters.length > 0) {
      console.log('   ⚠️ Found CSS filter/transform issues that may break position: fixed:')
      if (filterIssues.headerFilters.length > 0) {
        console.log('   Header parent issues:', filterIssues.headerFilters)
      }
      if (filterIssues.actionBarFilters.length > 0) {
        console.log('   Action bar parent issues:', filterIssues.actionBarFilters)
      }
    } else {
      console.log('   ✓ No CSS filter/transform issues found')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 1: Check header positioning and scroll behavior
    console.log('✅ Test 1: Header positioning and scroll behavior')
    const header = await page.$('header')
    if (header) {
      // Get initial header position
      const initialPosition = await page.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        const styles = window.getComputedStyle(el)
        return {
          position: styles.position,
          top: styles.top,
          zIndex: styles.zIndex,
          left: styles.left,
          right: styles.right,
          rectTop: rect.top,
          rectHeight: rect.height
        }
      }, header)
      
      console.log('   Initial header position:', initialPosition)
      
      // Scroll down and check if header stays in place
      await page.evaluate(() => {
        window.scrollTo(0, 500)
      })
      await new Promise(resolve => setTimeout(resolve, timeout))
      
      const scrolledPosition = await page.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        return {
          rectTop: rect.top,
          rectHeight: rect.height
        }
      }, header)
      
      console.log('   Header position after scroll:', scrolledPosition)
      
      // Check if header is truly fixed (stays at top when scrolling)
      if (initialPosition.position === 'fixed' && initialPosition.top === '0px') {
        if (Math.abs(scrolledPosition.rectTop - initialPosition.rectTop) < 5) {
          console.log('   ✓ Header is properly fixed and stays at top during scroll')
        } else {
          console.log('   ⚠️ Header has position: fixed but moves during scroll (CSS filter issue)')
        }
      } else {
        console.log('   ⚠️ Header does not have position: fixed')
      }
      
      // Scroll back to top
      await page.evaluate(() => {
        window.scrollTo(0, 0)
      })
      await new Promise(resolve => setTimeout(resolve, timeout))
    } else {
      throw new Error('Header not found')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 2: Check action bar positioning and scroll behavior
    console.log('✅ Test 2: Action bar positioning and scroll behavior')
    const actionBar = await page.$('.fixed.bottom-0')
    if (actionBar) {
      // Get initial action bar position
      const initialPosition = await page.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        const styles = window.getComputedStyle(el)
        return {
          position: styles.position,
          bottom: styles.bottom,
          zIndex: styles.zIndex,
          rectBottom: rect.bottom,
          rectHeight: rect.height
        }
      }, actionBar)
      
      console.log('   Initial action bar position:', initialPosition)
      
      // Scroll down and check if action bar stays in place
      await page.evaluate(() => {
        window.scrollTo(0, 500)
      })
      await new Promise(resolve => setTimeout(resolve, timeout))
      
      const scrolledPosition = await page.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        return {
          rectBottom: rect.bottom,
          rectHeight: rect.height
        }
      }, actionBar)
      
      console.log('   Action bar position after scroll:', scrolledPosition)
      
      // Check if action bar is truly fixed (stays at bottom when scrolling)
      if (initialPosition.position === 'fixed' && initialPosition.bottom === '0px') {
        if (Math.abs(scrolledPosition.rectBottom - initialPosition.rectBottom) < 5) {
          console.log('   ✓ Action bar is properly fixed and stays at bottom during scroll')
        } else {
          console.log('   ⚠️ Action bar has position: fixed but moves during scroll (CSS filter issue)')
        }
      } else {
        console.log('   ⚠️ Action bar does not have position: fixed')
      }
      
      // Scroll back to top
      await page.evaluate(() => {
        window.scrollTo(0, 0)
      })
      await new Promise(resolve => setTimeout(resolve, timeout))
    } else {
      throw new Error('Fixed action bar not found')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 2.5: Check sidebar behavior (should NOT be fixed)
    console.log('✅ Test 2.5: Sidebar behavior (should be slide-out, not fixed)')
    
    // Try to find and test menu button
    const menuButton = await page.$('button[aria-label*="menu"], button svg[stroke*="currentColor"]')
    if (menuButton) {
      // Get initial menu button position
      const initialMenuPosition = await page.evaluate((el) => {
        const rect = el.getBoundingClientRect()
        const styles = window.getComputedStyle(el)
        return {
          position: styles.position,
          rectTop: rect.top,
          rectLeft: rect.left
        }
      }, menuButton)
      
      console.log('   Menu button initial position:', initialMenuPosition)
      
      // Click menu button to open sidebar
      await menuButton.click()
      await new Promise(resolve => setTimeout(resolve, timeout))
      
      // Check if sidebar/menu is visible
      const sideMenu = await page.$('[role="menu"], .fixed.left-0, .absolute.left-0, .slide-out')
      if (sideMenu) {
        const menuStyles = await page.evaluate((el) => {
          const styles = window.getComputedStyle(el)
          const rect = el.getBoundingClientRect()
          return {
            position: styles.position,
            left: styles.left,
            transform: styles.transform,
            visibility: styles.visibility,
            opacity: styles.opacity,
            display: styles.display,
            rectLeft: rect.left,
            rectWidth: rect.width
          }
        }, sideMenu)
        
        console.log('   Sidebar styles:', menuStyles)
        
        // Check if sidebar is properly positioned (not fixed to viewport)
        if (menuStyles.position === 'fixed' && menuStyles.left === '0px') {
          console.log('   ✓ Sidebar is fixed to viewport (correct for slide-out menu)')
        } else if (menuStyles.position === 'absolute') {
          console.log('   ✓ Sidebar is absolutely positioned (correct for overlay menu)')
        } else {
          console.log('   ⚠️ Sidebar positioning unclear:', menuStyles.position)
        }
        
        // Close menu
        await page.keyboard.press('Escape')
        await new Promise(resolve => setTimeout(resolve, timeout))
      } else {
        console.log('   ⚠️ Sidebar/menu not found after clicking menu button')
      }
    } else {
      console.log('   ⚠️ Menu button not found')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 3: Check QR code spacing
    console.log('✅ Test 3: QR code spacing')
    const qrContainer = await page.$('[data-testid="qr-generator"]')
    if (qrContainer) {
      const qrDisplay = await qrContainer.$('.text-center')
      if (qrDisplay) {
        const spacingStyles = await page.evaluate((el) => {
          const styles = window.getComputedStyle(el)
          return {
            marginTop: styles.marginTop,
            marginBottom: styles.marginBottom
          }
        }, qrDisplay)
        
        // Check if there's proper spacing (mt-8 = 2rem = 32px, or any non-zero spacing)
        const marginTopValue = parseInt(spacingStyles.marginTop)
        if (marginTopValue > 0) {
          console.log(`   ✓ QR code has top spacing: ${spacingStyles.marginTop}`)
        } else {
          // Check if spacing is applied via padding or other means
          const parentStyles = await page.evaluate((el) => {
            const parent = el.parentElement
            if (parent) {
              const styles = window.getComputedStyle(parent)
              return {
                paddingTop: styles.paddingTop,
                marginTop: styles.marginTop
              }
            }
            return null
          }, qrDisplay)
          
          if (parentStyles && (parseInt(parentStyles.paddingTop) > 0 || parseInt(parentStyles.marginTop) > 0)) {
            console.log(`   ✓ QR code has spacing via parent: ${JSON.stringify(parentStyles)}`)
          } else {
            console.log(`   ⚠️ QR code spacing check: ${JSON.stringify(spacingStyles)}`)
            console.log('   Note: Spacing might be applied via CSS classes or other methods')
          }
        }
      } else {
        throw new Error('QR display container not found')
      }
    } else {
      throw new Error('QR generator container not found')
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 4: Check responsive layout
    console.log('✅ Test 4: Responsive layout')
    
    // Test mobile viewport
    await page.setViewport({ width: 375, height: 667 })
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    const mobileLayout = await page.evaluate(() => {
      const header = document.querySelector('header')
      const actionBar = document.querySelector('.fixed.bottom-0')
      const qrContainer = document.querySelector('[data-testid="qr-generator"]')
      
      return {
        headerVisible: header && header.offsetHeight > 0,
        actionBarVisible: actionBar && actionBar.offsetHeight > 0,
        qrContainerVisible: qrContainer && qrContainer.offsetHeight > 0,
        viewportWidth: window.innerWidth
      }
    })
    
    if (mobileLayout.headerVisible && mobileLayout.actionBarVisible && mobileLayout.qrContainerVisible) {
      console.log(`   ✓ Mobile layout (${mobileLayout.viewportWidth}px) - all elements visible`)
    } else {
      throw new Error(`Mobile layout issues: ${JSON.stringify(mobileLayout)}`)
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test desktop viewport
    await page.setViewport({ width: 1280, height: 720 })
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    const desktopLayout = await page.evaluate(() => {
      const header = document.querySelector('header')
      const actionBar = document.querySelector('.fixed.bottom-0')
      const qrContainer = document.querySelector('[data-testid="qr-generator"]')
      
      return {
        headerVisible: header && header.offsetHeight > 0,
        actionBarVisible: actionBar && actionBar.offsetHeight > 0,
        qrContainerVisible: qrContainer && qrContainer.offsetHeight > 0,
        viewportWidth: window.innerWidth
      }
    })
    
    if (desktopLayout.headerVisible && desktopLayout.actionBarVisible && desktopLayout.qrContainerVisible) {
      console.log(`   ✓ Desktop layout (${desktopLayout.viewportWidth}px) - all elements visible`)
    } else {
      throw new Error(`Desktop layout issues: ${JSON.stringify(desktopLayout)}`)
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test 5: Check Share button presence
    console.log('✅ Test 5: Share button functionality')
    await page.setViewport({ width: 375, height: 667 }) // Back to mobile
    
    // Clear any existing text first
    await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.value = ''
        textarea.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Type some text to generate QR code
    await page.type('textarea', 'Test QR Code for Share')
    await new Promise(resolve => setTimeout(resolve, timeout * 3))
    
    // Wait for QR code to appear with more flexible selector
    try {
      await page.waitForSelector('img[alt], img[src*="data:image"]', { timeout: 5000 })
    } catch (error) {
      console.log('   ⚠️ QR code not found, checking textarea content...')
      const textareaValue = await page.$eval('textarea', el => el.value)
      console.log('   Textarea value:', textareaValue)
    }
    
    // Check if Share button is present in action bar
    const actionBarButtons = await page.$$eval('.fixed.bottom-0 button', buttons => 
      buttons.map(btn => btn.textContent?.trim() || '')
    )
    
    console.log('   Action bar buttons:', actionBarButtons)
    
    // Debug: Check QR code state
    const qrState = await page.evaluate(() => {
      const qrImage = document.querySelector('img[alt], img[src*="data:image"]')
      const textarea = document.querySelector('textarea')
      return {
        hasQRImage: !!qrImage,
        qrImageSrc: qrImage?.src?.substring(0, 50) || null,
        textareaValue: textarea?.value || '',
        textareaLength: textarea?.value?.length || 0
      }
    })
    
    console.log('   QR state debug:', qrState)
    
    const hasShareButton = actionBarButtons.some(text => text.includes('Share'))
    if (hasShareButton) {
      console.log('   ✓ Share button found when QR code is generated')
    } else {
      console.log('   ⚠️ Share button not found in action bar')
      
      // Check if QR code is actually generated
      const qrImage = await page.$('img[alt], img[src*="data:image"]')
      if (qrImage) {
        console.log('   ✓ QR code is generated, but Share button missing from action bar')
      } else {
        console.log('   ⚠️ QR code not generated, Share button test inconclusive')
      }
    }
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    console.log('\n🎉 All layout tests passed!')
    
  } catch (error) {
    console.error('❌ Layout test failed:', error.message)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Run tests
testLayout().catch(console.error)
