import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:3000'

async function testMenuSimple() {
  console.log('🧭 Testing Menu Simple...')
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
    
    // Wait a bit for the page to fully load
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Take a screenshot to see what's happening
    await page.screenshot({ path: 'menu-test.png' })
    console.log('📸 Screenshot saved as menu-test.png')
    
    // Check if there are any buttons on the page
    const buttons = await page.$$eval('button', els => 
      els.map(el => ({ 
        text: el.textContent?.trim(), 
        className: el.className,
        ariaLabel: el.getAttribute('aria-label')
      }))
    )
    
    console.log(`✅ Found ${buttons.length} buttons:`)
    buttons.forEach((btn, i) => {
      console.log(`  ${i + 1}. Text: "${btn.text}", Class: "${btn.className}", Aria: "${btn.ariaLabel}"`)
    })
    
    // Try to find and click the menu button (first button with hamburger icon)
    const menuButton = buttons[0] // The first button is the menu button
    
    if (menuButton) {
      console.log(`✅ Found menu button: "${menuButton.text}"`)
      
      // Click the first button (menu button)
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button')
        if (buttons[0]) {
          console.log('Clicking first button (menu)...')
          buttons[0].click()
        }
      })
      
      // Wait for menu to appear
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check for menu items
      const menuItems = await page.$$eval('a', els => 
        els.map(el => ({ href: el.href, text: el.textContent.trim() }))
      )
      
      console.log(`✅ Found ${menuItems.length} links after clicking menu:`)
      menuItems.forEach((item, i) => {
        console.log(`  ${i + 1}. "${item.text}" -> ${item.href}`)
      })
      
      // Check for our new menu items
      const factsLink = menuItems.find(item => item.href.includes('qr-code-facts'))
      const useCasesLink = menuItems.find(item => item.href.includes('qr-code-use-cases'))
      
      console.log(`✅ QR Code Facts link found: ${!!factsLink}`)
      console.log(`✅ QR Code Use Cases link found: ${!!useCasesLink}`)
      
      if (factsLink) {
        console.log(`✅ Facts link: "${factsLink.text}"`)
      }
      
      if (useCasesLink) {
        console.log(`✅ Use Cases link: "${useCasesLink.text}"`)
      }
      
    } else {
      console.log('❌ No menu button found')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    throw error
  } finally {
    await browser.close()
  }
}

// Run the test
testMenuSimple().catch(console.error)
