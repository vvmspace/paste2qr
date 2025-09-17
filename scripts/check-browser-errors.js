import puppeteer from 'puppeteer'

async function checkBrowserErrors() {
  let browser
  try {
    console.log('🔍 Checking browser errors...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Collect console messages
    const consoleMessages = []
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      })
    })
    
    // Collect page errors
    const pageErrors = []
    page.on('pageerror', error => {
      pageErrors.push({
        message: error.message,
        stack: error.stack
      })
    })
    
    // Navigate to the app
    console.log('📱 Navigating to http://localhost:3000...')
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 })
    } catch (error) {
      console.log('❌ Navigation failed:', error.message)
    }
    
    // Wait a bit for any async errors
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Report console messages
    console.log('\n📋 Console Messages:')
    if (consoleMessages.length === 0) {
      console.log('   No console messages')
    } else {
      consoleMessages.forEach((msg, index) => {
        console.log(`   ${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`)
        if (msg.location.url) {
          console.log(`      Location: ${msg.location.url}:${msg.location.lineNumber}`)
        }
      })
    }
    
    // Report page errors
    console.log('\n🚨 Page Errors:')
    if (pageErrors.length === 0) {
      console.log('   No page errors')
    } else {
      pageErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.message}`)
        if (error.stack) {
          console.log(`      Stack: ${error.stack.split('\n')[0]}`)
        }
      })
    }
    
    // Check if page loaded successfully
    const title = await page.title()
    console.log(`\n📄 Page Title: "${title}"`)
    
    // Check for specific elements
    const textarea = await page.$('textarea')
    const qrCode = await page.$('img[alt="Generated QR Code"]')
    const pasteButton = await page.$('button')
    
    console.log('\n🔍 Elements Check:')
    console.log(`   Textarea: ${textarea ? '✓ Found' : '❌ Not found'}`)
    console.log(`   QR Code: ${qrCode ? '✓ Found' : '❌ Not found'}`)
    console.log(`   Button: ${pasteButton ? '✓ Found' : '❌ Not found'}`)
    
    // Get page content preview
    const bodyText = await page.evaluate(() => {
      return document.body ? document.body.textContent.substring(0, 200) : 'No body content'
    })
    console.log(`\n📝 Page Content Preview: "${bodyText}..."`)

  } catch (error) {
    console.error('❌ Browser error check failed:', error)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

checkBrowserErrors()
