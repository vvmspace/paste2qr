/**
 * Test hydration mismatch issues
 */

const puppeteer = require('puppeteer')

async function testHydration() {
  const browser = await puppeteer.launch({ 
    headless: false,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text())
    } else if (msg.text().includes('hydration') || msg.text().includes('Hydration')) {
      console.log('🔍 Hydration:', msg.text())
    }
  })
  
  // Enable network monitoring
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('❌ Network Error:', response.url(), response.status())
    }
  })
  
  console.log('🔍 Testing hydration on main page...')
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
  
  // Wait for hydration to complete
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Check for hydration errors in console
  const consoleMessages = []
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().includes('hydration')) {
      consoleMessages.push(msg.text())
    }
  })
  
  // Test different locales
  const locales = ['en', 'es', 'zh', 'fr', 'am', 'pt']
  
  for (const locale of locales) {
    console.log(`🔍 Testing hydration on /${locale}...`)
    await page.goto(`http://localhost:3000/${locale}`, { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Test specific pages
  const pages = [
    '/wifi-qr-code-generator',
    '/phone-number-qr-code', 
    '/email-qr-code-generator',
    '/sms-qr-code-maker'
  ]
  
  for (const pagePath of pages) {
    console.log(`🔍 Testing hydration on ${pagePath}...`)
    await page.goto(`http://localhost:3000${pagePath}`, { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Test localized pages
  for (const locale of locales) {
    for (const pagePath of pages) {
      console.log(`🔍 Testing hydration on /${locale}${pagePath}...`)
      await page.goto(`http://localhost:3000/${locale}${pagePath}`, { waitUntil: 'networkidle0' })
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  console.log('✅ Hydration test completed')
  
  await browser.close()
}

testHydration().catch(console.error)
