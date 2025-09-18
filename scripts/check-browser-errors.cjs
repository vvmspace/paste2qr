/**
 * Check for browser errors and console logs
 */

const puppeteer = require('puppeteer')

async function checkBrowserErrors() {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  // Collect all console messages
  const consoleMessages = []
  const errors = []
  
  page.on('console', msg => {
    const message = {
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    }
    consoleMessages.push(message)
    
    if (msg.type() === 'error') {
      errors.push(message)
      console.log('❌ Console Error:', msg.text())
    } else if (msg.type() === 'warning') {
      console.log('⚠️ Console Warning:', msg.text())
    } else {
      console.log(`📝 Console ${msg.type()}:`, msg.text())
    }
  })
  
  // Monitor network errors
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('❌ Network Error:', response.url(), response.status())
    }
  })
  
  // Check for page errors
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message)
    errors.push({ type: 'pageerror', text: error.message, location: error.stack })
  })
  
  console.log('🔍 Checking browser errors on main page...')
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
  
  // Wait for hydration and any async operations
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Check for React hydration errors
  const hydrationErrors = await page.evaluate(() => {
    const errors = []
    // Check for hydration mismatch warnings
    const scripts = document.querySelectorAll('script')
    scripts.forEach(script => {
      if (script.textContent && script.textContent.includes('hydration')) {
        errors.push('Hydration warning found in script')
      }
    })
    return errors
  })
  
  if (hydrationErrors.length > 0) {
    console.log('❌ Hydration Errors:', hydrationErrors)
  }
  
  // Test different pages
  const testPages = [
    '/en',
    '/es', 
    '/wifi-qr-code-generator',
    '/phone-number-qr-code'
  ]
  
  for (const pagePath of testPages) {
    console.log(`🔍 Checking errors on ${pagePath}...`)
    await page.goto(`http://localhost:3000${pagePath}`, { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  console.log('\n📊 Summary:')
  console.log(`Total console messages: ${consoleMessages.length}`)
  console.log(`Errors: ${errors.length}`)
  console.log(`Warnings: ${consoleMessages.filter(m => m.type === 'warning').length}`)
  
  if (errors.length > 0) {
    console.log('\n❌ All Errors:')
    errors.forEach((error, index) => {
      console.log(`${index + 1}. [${error.type}] ${error.text}`)
    })
  }
  
  await browser.close()
}

checkBrowserErrors().catch(console.error)
