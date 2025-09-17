import puppeteer from 'puppeteer'

async function testModalPositioning() {
  let browser
  try {
    console.log('📐 Testing Modal Positioning...')

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
      await page.keyboard.type('Custom QR Code Text for Testing')
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
    
    // Test 2: Check modal positioning
    console.log('\n✅ Test 2: Check Modal Positioning')
    const modal = await page.$('.fixed.inset-0.bg-white.z-50')
    if (modal) {
      const modalStyles = await modal.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          position: styles.position,
          top: styles.top,
          left: styles.left,
          right: styles.right,
          bottom: styles.bottom,
          width: styles.width,
          height: styles.height,
          zIndex: styles.zIndex,
          backgroundColor: styles.backgroundColor
        }
      })
      
      console.log(`   Position: ${modalStyles.position}`)
      console.log(`   Top: ${modalStyles.top}`)
      console.log(`   Left: ${modalStyles.left}`)
      console.log(`   Right: ${modalStyles.right}`)
      console.log(`   Bottom: ${modalStyles.bottom}`)
      console.log(`   Width: ${modalStyles.width}`)
      console.log(`   Height: ${modalStyles.height}`)
      console.log(`   Z-index: ${modalStyles.zIndex}`)
      console.log(`   Background: ${modalStyles.backgroundColor}`)
      
      // Check if modal covers full screen
      const coversFullScreen = modalStyles.top === '0px' && 
                              modalStyles.left === '0px' && 
                              modalStyles.right === '0px' && 
                              modalStyles.bottom === '0px'
      console.log(`   Covers full screen: ${coversFullScreen ? '✓' : '❌'}`)
    }
    
    // Test 3: Check if fixed action bar is hidden
    console.log('\n✅ Test 3: Check Fixed Action Bar Visibility')
    const actionBar = await page.$('.fixed.bottom-0.left-0.right-0.bg-white.border-t')
    if (actionBar) {
      const actionBarStyles = await actionBar.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          opacity: styles.opacity,
          pointerEvents: styles.pointerEvents,
          visibility: styles.visibility
        }
      })
      
      console.log(`   Action bar opacity: ${actionBarStyles.opacity}`)
      console.log(`   Action bar pointer-events: ${actionBarStyles.pointerEvents}`)
      console.log(`   Action bar visibility: ${actionBarStyles.visibility}`)
      
      const isHidden = actionBarStyles.opacity === '0' || actionBarStyles.pointerEvents === 'none'
      console.log(`   Action bar hidden: ${isHidden ? '✓' : '❌'}`)
    }
    
    // Test 4: Check modal header positioning
    console.log('\n✅ Test 4: Check Modal Header')
    const header = await page.$('.flex.items-center.justify-between.p-4.border-b')
    if (header) {
      const headerStyles = await header.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          position: styles.position,
          top: styles.top,
          left: styles.left,
          right: styles.right,
          flexShrink: styles.flexShrink
        }
      })
      
      console.log(`   Header position: ${headerStyles.position}`)
      console.log(`   Header flex-shrink: ${headerStyles.flexShrink}`)
    }
    
    // Test 5: Check modal content positioning
    console.log('\n✅ Test 5: Check Modal Content')
    const content = await page.$('.flex-1.p-6.overflow-y-auto')
    if (content) {
      const contentStyles = await content.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          flex: styles.flex,
          overflow: styles.overflow,
          minHeight: styles.minHeight
        }
      })
      
      console.log(`   Content flex: ${contentStyles.flex}`)
      console.log(`   Content overflow: ${contentStyles.overflow}`)
      console.log(`   Content min-height: ${contentStyles.minHeight}`)
    }
    
    // Test 6: Check form positioning
    console.log('\n✅ Test 6: Check Form Positioning')
    const form = await page.$('form.max-w-md.mx-auto')
    if (form) {
      const formStyles = await form.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return {
          maxWidth: styles.maxWidth,
          marginLeft: styles.marginLeft,
          marginRight: styles.marginRight
        }
      })
      
      console.log(`   Form max-width: ${formStyles.maxWidth}`)
      console.log(`   Form margin-left: ${formStyles.marginLeft}`)
      console.log(`   Form margin-right: ${formStyles.marginRight}`)
    }
    
    // Test 7: Test close button functionality
    console.log('\n✅ Test 7: Test Close Button')
    const closeButton = await page.$('button svg path[d*="M6 18L18 6"]')
    if (closeButton) {
      await closeButton.click()
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const modalAfterClose = await page.$('.fixed.inset-0.bg-white.z-50')
      const modalStillExists = await modalAfterClose?.evaluate(el => el !== null)
      console.log(`   Modal closed: ${!modalStillExists ? '✓' : '❌'}`)
      
      // Check if action bar is visible again
      const actionBarAfterClose = await page.$('.fixed.bottom-0.left-0.right-0.bg-white.border-t')
      if (actionBarAfterClose) {
        const actionBarStylesAfter = await actionBarAfterClose.evaluate(el => {
          const styles = window.getComputedStyle(el)
          return {
            opacity: styles.opacity,
            pointerEvents: styles.pointerEvents
          }
        })
        
        const isVisibleAgain = actionBarStylesAfter.opacity === '1' && actionBarStylesAfter.pointerEvents === 'auto'
        console.log(`   Action bar visible again: ${isVisibleAgain ? '✓' : '❌'}`)
      }
    }
    
    console.log('\n🎉 All positioning tests completed!')

  } catch (error) {
    console.error('❌ Positioning test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testModalPositioning()
