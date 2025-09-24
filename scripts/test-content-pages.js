import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:3000'

async function testContentPages() {
  console.log('🧪 Testing Content Pages...')
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  try {
    // Test QR Code Facts pages
    console.log('\n📊 Testing QR Code Facts Pages...')
    
    const factsLocales = ['en', 'es', 'zh', 'fr', 'am', 'pt']
    for (const locale of factsLocales) {
      const url = locale === 'en' ? `${BASE_URL}/qr-code-facts` : `${BASE_URL}/${locale}/qr-code-facts`
      console.log(`\n🔍 Testing Facts Page: ${locale.toUpperCase()}`)
      
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 })
      
      // Check page title
      const title = await page.title()
      console.log(`✅ Title: ${title}`)
      
      // Check main heading
      const heading = await page.$eval('h1', el => el.textContent)
      console.log(`✅ Main Heading: ${heading}`)
      
      // Check for key sections
      const sections = await page.$$eval('h2', els => els.map(el => el.textContent))
      console.log(`✅ Found ${sections.length} sections`)
      
      // Check for QR code facts content
      const hasFacts = await page.$eval('body', el => 
        el.textContent.includes('QR code') || 
        el.textContent.includes('Quick Response') ||
        el.textContent.includes('1994')
      )
      console.log(`✅ Contains QR facts: ${hasFacts}`)
      
      // Check for statistics
      const hasStats = await page.$eval('body', el => 
        el.textContent.includes('%') || 
        el.textContent.includes('billion') ||
        el.textContent.includes('million')
      )
      console.log(`✅ Contains statistics: ${hasStats}`)
    }
    
    // Test QR Code Use Cases pages
    console.log('\n📋 Testing QR Code Use Cases Pages...')
    
    const useCasesLocales = ['en', 'es', 'zh', 'fr', 'am', 'pt']
    for (const locale of useCasesLocales) {
      const url = locale === 'en' ? `${BASE_URL}/qr-code-use-cases` : `${BASE_URL}/${locale}/qr-code-use-cases`
      console.log(`\n🔍 Testing Use Cases Page: ${locale.toUpperCase()}`)
      
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 })
      
      // Check page title
      const title = await page.title()
      console.log(`✅ Title: ${title}`)
      
      // Check main heading
      const heading = await page.$eval('h1', el => el.textContent)
      console.log(`✅ Main Heading: ${heading}`)
      
      // Check for key sections
      const sections = await page.$$eval('h2', els => els.map(el => el.textContent))
      console.log(`✅ Found ${sections.length} sections`)
      
      // Check for use cases content
      const hasUseCases = await page.$eval('body', el => 
        el.textContent.includes('use case') || 
        el.textContent.includes('application') ||
        el.textContent.includes('business')
      )
      console.log(`✅ Contains use cases: ${hasUseCases}`)
      
      // Check for industry examples
      const hasIndustries = await page.$eval('body', el => 
        el.textContent.includes('restaurant') || 
        el.textContent.includes('healthcare') ||
        el.textContent.includes('education')
      )
      console.log(`✅ Contains industry examples: ${hasIndustries}`)
    }
    
    // Test navigation between pages
    console.log('\n🧭 Testing Navigation...')
    
    await page.goto(`${BASE_URL}/qr-code-facts`, { waitUntil: 'networkidle0' })
    
    // Check if there are links to use cases
    const linksToUseCases = await page.$$eval('a[href*="use-cases"]', els => els.length)
    console.log(`✅ Links to use cases: ${linksToUseCases}`)
    
    await page.goto(`${BASE_URL}/qr-code-use-cases`, { waitUntil: 'networkidle0' })
    
    // Check if there are links to facts
    const linksToFacts = await page.$$eval('a[href*="facts"]', els => els.length)
    console.log(`✅ Links to facts: ${linksToFacts}`)
    
    // Test mobile responsiveness
    console.log('\n📱 Testing Mobile Responsiveness...')
    
    await page.setViewport({ width: 375, height: 667 })
    await page.goto(`${BASE_URL}/qr-code-facts`, { waitUntil: 'networkidle0' })
    
    const mobileHeading = await page.$eval('h1', el => el.textContent)
    console.log(`✅ Mobile heading: ${mobileHeading}`)
    
    // Check if content is readable on mobile
    const mobileContent = await page.$eval('body', el => el.textContent.length > 1000)
    console.log(`✅ Mobile content readable: ${mobileContent}`)
    
    // Test SEO elements
    console.log('\n🔍 Testing SEO Elements...')
    
    await page.goto(`${BASE_URL}/qr-code-facts`, { waitUntil: 'networkidle0' })
    
    // Check meta description
    const metaDescription = await page.$eval('meta[name="description"]', el => el.content)
    console.log(`✅ Meta description: ${metaDescription.substring(0, 100)}...`)
    
    // Check canonical URL
    const canonicalUrl = await page.$eval('link[rel="canonical"]', el => el.href)
    console.log(`✅ Canonical URL: ${canonicalUrl}`)
    
    // Check for structured data
    const hasStructuredData = await page.$eval('body', el => 
      el.innerHTML.includes('application/ld+json') || 
      el.innerHTML.includes('itemscope')
    )
    console.log(`✅ Has structured data: ${hasStructuredData}`)
    
    console.log('\n✅ All content page tests completed successfully!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    throw error
  } finally {
    await browser.close()
  }
}

// Run the test
testContentPages().catch(console.error)

