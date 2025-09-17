import puppeteer from 'puppeteer'

async function testMDXPages() {
  let browser
  try {
    console.log('📄 Testing MDX pages...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test pages
    const testPages = [
      { url: '/', name: 'Home Page' },
      { url: '/wifi-qr-code-generator', name: 'WiFi QR Generator' },
      { url: '/phone-number-qr-code', name: 'Phone Number QR' },
      { url: '/email-qr-code-generator', name: 'Email QR Generator' },
      { url: '/sms-qr-code-maker', name: 'SMS QR Maker' },
    ]
    
    for (const testPage of testPages) {
      console.log(`\n✅ Testing ${testPage.name} (${testPage.url})`)
      
      try {
        // Navigate to page
        await page.goto(`http://localhost:3000${testPage.url}`, { waitUntil: 'networkidle0' })
        
        // Check page title
        const title = await page.title()
        console.log(`   Title: "${title}"`)
        
        // Check if page loaded successfully
        const hasError = await page.$('.next-error-h1')
        if (hasError) {
          console.log('   ❌ Page has error')
          continue
        }
        
        // Check essential elements
        const textarea = await page.$('textarea[placeholder*="Paste any text"]')
        const pasteButton = await page.$('button')
        const heroTitle = await page.$('h1')
        
        console.log(`   Textarea: ${textarea ? '✓' : '❌'}`)
        console.log(`   Paste Button: ${pasteButton ? '✓' : '❌'}`)
        console.log(`   Hero Title: ${heroTitle ? '✓' : '❌'}`)
        
        // Check for content sections
        const contentSections = await page.$$eval('h2, h3', elements => 
          elements.map(el => el.textContent)
        )
        console.log(`   Content Sections: ${contentSections.length} found`)
        
        // Check for features section
        const features = await page.$$('.text-2xl.font-bold, .text-xl.font-semibold')
        console.log(`   Features/Headings: ${features.length} found`)
        
        // Check for FAQ section
        const faqItems = await page.$$eval('h4', elements => 
          elements.filter(el => el.textContent.includes('?')).length
        )
        console.log(`   FAQ Items: ${faqItems} found`)
        
        // Test QR generation
        if (textarea) {
          await textarea.click()
          await page.keyboard.type('Test QR Code')
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const qrCode = await page.$('img[alt="Generated QR Code"]')
          console.log(`   QR Generation: ${qrCode ? '✓' : '❌'}`)
        }
        
        console.log(`   ✓ ${testPage.name} test completed`)
        
      } catch (error) {
        console.log(`   ❌ ${testPage.name} failed: ${error.message}`)
      }
    }
    
    // Test specific MDX content
    console.log('\n✅ Testing MDX Content Rendering')
    await page.goto('http://localhost:3000/wifi-qr-code-generator', { waitUntil: 'networkidle0' })
    
    // Check for MDX-specific content
    const mdxContent = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2, h3, h4')).map(h => h.textContent)
      const lists = document.querySelectorAll('ul, ol').length
      const paragraphs = document.querySelectorAll('p').length
      
      return {
        headings,
        lists,
        paragraphs,
        hasWiFiContent: document.body.textContent.includes('WiFi') || document.body.textContent.includes('wifi')
      }
    })
    
    console.log(`   MDX Headings: ${mdxContent.headings.length}`)
    console.log(`   MDX Lists: ${mdxContent.lists}`)
    console.log(`   MDX Paragraphs: ${mdxContent.paragraphs}`)
    console.log(`   WiFi Content: ${mdxContent.hasWiFiContent ? '✓' : '❌'}`)
    
    // Test metadata
    console.log('\n✅ Testing Page Metadata')
    const metadata = await page.evaluate(() => {
      const title = document.title
      const description = document.querySelector('meta[name="description"]')?.content
      const keywords = document.querySelector('meta[name="keywords"]')?.content
      
      return { title, description, keywords }
    })
    
    console.log(`   Meta Title: "${metadata.title}"`)
    console.log(`   Meta Description: "${metadata.description?.substring(0, 50)}..."`)
    console.log(`   Meta Keywords: "${metadata.keywords?.substring(0, 50)}..."`)

    console.log('\n🎉 All MDX page tests completed!')

  } catch (error) {
    console.error('❌ MDX page test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testMDXPages()
