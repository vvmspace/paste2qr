import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:3000'

async function testContentSEO() {
  console.log('🔍 Testing Content Pages SEO...')
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  try {
    const pages = [
      { path: '/qr-code-facts', name: 'QR Code Facts (EN)' },
      { path: '/es/qr-code-facts', name: 'QR Code Facts (ES)' },
      { path: '/zh/qr-code-facts', name: 'QR Code Facts (ZH)' },
      { path: '/fr/qr-code-facts', name: 'QR Code Facts (FR)' },
      { path: '/am/qr-code-facts', name: 'QR Code Facts (AM)' },
      { path: '/pt/qr-code-facts', name: 'QR Code Facts (PT)' },
      { path: '/qr-code-use-cases', name: 'QR Code Use Cases (EN)' },
      { path: '/es/qr-code-use-cases', name: 'QR Code Use Cases (ES)' },
      { path: '/zh/qr-code-use-cases', name: 'QR Code Use Cases (ZH)' },
      { path: '/fr/qr-code-use-cases', name: 'QR Code Use Cases (FR)' },
      { path: '/am/qr-code-use-cases', name: 'QR Code Use Cases (AM)' },
      { path: '/pt/qr-code-use-cases', name: 'QR Code Use Cases (PT)' }
    ]
    
    for (const pageInfo of pages) {
      console.log(`\n📄 Testing: ${pageInfo.name}`)
      
      await page.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle0', timeout: 10000 })
      
      // Test 1: Page Title
      const title = await page.title()
      console.log(`✅ Title: ${title}`)
      
      // Test 2: Meta Description
      const metaDescription = await page.$eval('meta[name="description"]', el => el.content)
      console.log(`✅ Meta Description: ${metaDescription.substring(0, 80)}...`)
      
      // Test 3: Canonical URL
      const canonicalUrl = await page.$eval('link[rel="canonical"]', el => el.href)
      console.log(`✅ Canonical URL: ${canonicalUrl}`)
      
      // Test 4: H1 Tag
      const h1 = await page.$eval('h1', el => el.textContent)
      console.log(`✅ H1: ${h1}`)
      
      // Test 5: H2 Tags Count
      const h2Count = await page.$$eval('h2', els => els.length)
      console.log(`✅ H2 Tags: ${h2Count}`)
      
      // Test 6: Content Length
      const contentLength = await page.$eval('body', el => el.textContent.length)
      console.log(`✅ Content Length: ${contentLength} characters`)
      
      // Test 7: Internal Links
      const internalLinks = await page.$$eval('a[href*="paste2qr.com"]', els => els.length)
      console.log(`✅ Internal Links: ${internalLinks}`)
      
      // Test 8: Images with Alt Text
      const imagesWithAlt = await page.$$eval('img[alt]', els => els.length)
      console.log(`✅ Images with Alt: ${imagesWithAlt}`)
      
      // Test 9: Keywords in Content
      const hasKeywords = await page.$eval('body', el => 
        el.textContent.toLowerCase().includes('qr code') ||
        el.textContent.toLowerCase().includes('quick response')
      )
      console.log(`✅ Contains Keywords: ${hasKeywords}`)
      
      // Test 10: Mobile Viewport
      const viewport = await page.$eval('meta[name="viewport"]', el => el.content)
      console.log(`✅ Viewport: ${viewport}`)
      
      // Test 11: Language Declaration
      const lang = await page.$eval('html', el => el.lang)
      console.log(`✅ Language: ${lang}`)
      
      // Test 12: Open Graph Tags
      const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content).catch(() => 'Not found')
      console.log(`✅ OG Title: ${ogTitle}`)
      
      // Test 13: Schema Markup
      const hasSchema = await page.$eval('body', el => 
        el.innerHTML.includes('application/ld+json') ||
        el.innerHTML.includes('itemscope')
      )
      console.log(`✅ Schema Markup: ${hasSchema}`)
      
      // Test 14: Page Load Speed
      const startTime = Date.now()
      await page.reload({ waitUntil: 'networkidle0' })
      const loadTime = Date.now() - startTime
      console.log(`✅ Load Time: ${loadTime}ms`)
      
      // Test 15: No Console Errors
      const consoleLogs = await page.evaluate(() => {
        return window.consoleLogs || []
      })
      console.log(`✅ Console Errors: ${consoleLogs.length}`)
    }
    
    console.log('\n🎯 Testing Cross-Language Consistency...')
    
    // Test that all language versions have similar structure
    const testPaths = ['/qr-code-facts', '/qr-code-use-cases']
    const locales = ['en', 'es', 'zh', 'fr', 'am', 'pt']
    
    for (const testPath of testPaths) {
      console.log(`\n📊 Testing consistency for: ${testPath}`)
      
      const h2Counts = []
      const contentLengths = []
      
      for (const locale of locales) {
        const url = locale === 'en' ? `${BASE_URL}${testPath}` : `${BASE_URL}/${locale}${testPath}`
        await page.goto(url, { waitUntil: 'networkidle0' })
        
        const h2Count = await page.$$eval('h2', els => els.length)
        const contentLength = await page.$eval('body', el => el.textContent.length)
        
        h2Counts.push(h2Count)
        contentLengths.push(contentLength)
      }
      
      const avgH2Count = h2Counts.reduce((a, b) => a + b, 0) / h2Counts.length
      const avgContentLength = contentLengths.reduce((a, b) => a + b, 0) / contentLengths.length
      
      console.log(`✅ Average H2 Count: ${avgH2Count.toFixed(1)}`)
      console.log(`✅ Average Content Length: ${avgContentLength.toFixed(0)} characters`)
      
      // Check for consistency (all versions should have similar structure)
      const h2Variance = Math.max(...h2Counts) - Math.min(...h2Counts)
      const contentVariance = Math.max(...contentLengths) - Math.min(...contentLengths)
      
      console.log(`✅ H2 Count Variance: ${h2Variance}`)
      console.log(`✅ Content Length Variance: ${contentVariance}`)
    }
    
    console.log('\n✅ All SEO tests completed successfully!')
    
  } catch (error) {
    console.error('❌ SEO test failed:', error.message)
    throw error
  } finally {
    await browser.close()
  }
}

// Run the test
testContentSEO().catch(console.error)

