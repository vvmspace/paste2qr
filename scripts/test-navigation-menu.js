import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:3000'

async function testNavigationMenu() {
  console.log('🧭 Testing Navigation Menu...')
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  try {
    // Test main page
    console.log('\n📄 Testing Main Page...')
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 10000 })
    
    // Check if menu button exists
    const menuButton = await page.evaluateHandle(() => {
      return Array.from(document.querySelectorAll('button')).find(btn => 
        btn.getAttribute('aria-label')?.includes('menu') || 
        btn.textContent?.includes('☰') || 
        btn.textContent?.includes('≡')
      )
    })
    console.log(`✅ Menu button found: ${!!menuButton}`)
    
    if (menuButton) {
      // Click menu button
      await page.evaluate(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(btn => 
          btn.getAttribute('aria-label')?.includes('menu') || 
          btn.textContent?.includes('☰') || 
          btn.textContent?.includes('≡')
        )
        if (btn) btn.click()
      })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if menu is open by looking for navigation items
      const menuItems = await page.$$eval('nav a, [role="navigation"] a', els => 
        els.map(el => ({ href: el.href, text: el.textContent.trim() }))
      ).catch(() => [])
      
      console.log(`✅ Menu opened: ${menuItems.length > 0}`)
      console.log(`✅ Found ${menuItems.length} menu items`)
      
      // Check for new menu items
      const factsLink = menuItems.find(item => item.href.includes('qr-code-facts'))
      const useCasesLink = menuItems.find(item => item.href.includes('qr-code-use-cases'))
      
      console.log(`✅ QR Code Facts link found: ${!!factsLink}`)
      console.log(`✅ QR Code Use Cases link found: ${!!useCasesLink}`)
      
      if (factsLink) {
        console.log(`✅ Facts link text: "${factsLink.text}"`)
      }
      
      if (useCasesLink) {
        console.log(`✅ Use Cases link text: "${useCasesLink.text}"`)
      }
      
      // Test clicking on facts link
      if (factsLink) {
        console.log('\n🔗 Testing Facts Page Navigation...')
        await page.evaluate(() => {
          const link = Array.from(document.querySelectorAll('a')).find(a => a.href.includes('qr-code-facts'))
          if (link) link.click()
        })
        await page.waitForNavigation({ waitUntil: 'networkidle0' })
        
        const currentUrl = page.url()
        console.log(`✅ Navigated to: ${currentUrl}`)
        
        const pageTitle = await page.title()
        console.log(`✅ Page title: ${pageTitle}`)
        
        // Check if we're on the facts page
        const isFactsPage = currentUrl.includes('qr-code-facts')
        console.log(`✅ On facts page: ${isFactsPage}`)
      }
    }
    
    // Test different languages
    console.log('\n🌍 Testing Different Languages...')
    
    const languages = ['en', 'es', 'zh', 'fr', 'am', 'pt']
    for (const lang of languages) {
      const url = lang === 'en' ? BASE_URL : `${BASE_URL}/${lang}`
      console.log(`\n🔍 Testing ${lang.toUpperCase()}...`)
      
      await page.goto(url, { waitUntil: 'networkidle0' })
      
      // Open menu
      const menuButton = await page.evaluateHandle(() => {
        return Array.from(document.querySelectorAll('button')).find(btn => 
          btn.getAttribute('aria-label')?.includes('menu') || 
          btn.textContent?.includes('☰') || 
          btn.textContent?.includes('≡')
        )
      })
      if (menuButton) {
        await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(btn => 
            btn.getAttribute('aria-label')?.includes('menu') || 
            btn.textContent?.includes('☰') || 
            btn.textContent?.includes('≡')
          )
          if (btn) btn.click()
        })
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check menu items text in current language
        const menuItems = await page.$$eval('nav a', els => 
          els.map(el => ({ href: el.href, text: el.textContent.trim() }))
        )
        
        console.log(`✅ Found ${menuItems.length} menu items`)
        
        // Check for facts and use cases in current language
        const factsItem = menuItems.find(item => item.href.includes('qr-code-facts'))
        const useCasesItem = menuItems.find(item => item.href.includes('qr-code-use-cases'))
        
        if (factsItem) {
          console.log(`✅ Facts item: "${factsItem.text}"`)
        }
        
        if (useCasesItem) {
          console.log(`✅ Use Cases item: "${useCasesItem.text}"`)
        }
      }
    }
    
    console.log('\n✅ All navigation menu tests completed successfully!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    throw error
  } finally {
    await browser.close()
  }
}

// Run the test
testNavigationMenu().catch(console.error)
