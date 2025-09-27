import puppeteer from 'puppeteer'

async function testAnalyticsFinal() {
  console.log('🔍 FINAL ANALYTICS TEST...')
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  })
  
  const page = await browser.newPage()
  
  // Перехватываем ВСЕ запросы
  const allRequests = []
  page.on('request', request => {
    allRequests.push({
      url: request.url(),
      method: request.method(),
      timestamp: new Date().toISOString()
    })
    
    if (request.url().includes('google') || request.url().includes('analytics') || request.url().includes('gtag')) {
      console.log('🌐 Analytics Request:', request.method(), request.url())
    }
  })
  
  try {
    console.log('🌐 Opening http://localhost:3000...')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    
    // Ждем полной загрузки Google Analytics
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    console.log('\n📊 STEP 1: CHECKING GOOGLE ANALYTICS SETUP...')
    const gaSetup = await page.evaluate(() => {
      return {
        gtag: typeof window.gtag,
        dataLayer: window.dataLayer ? window.dataLayer.length : 0,
        analyticsScript: !!document.querySelector('script[src*="googletagmanager.com"]'),
        trackingId: 'G-YSKXMZGQVF'
      }
    })
    console.log('📊 GA Setup:', gaSetup)
    
    console.log('\n🔲 STEP 2: TESTING QR GENERATION...')
    await page.type('textarea', 'Final Analytics Test QR Code')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const qrGenerated = await page.evaluate(() => {
      return !!document.querySelector('img[src*="data:image"]')
    })
    console.log('✅ QR Generated:', qrGenerated)
    
    console.log('\n🧭 STEP 3: TESTING MENU...')
    const menuButton = await page.$('button[aria-label="Open menu"]')
    if (menuButton) {
      await menuButton.click()
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const closeButton = await page.$('button[aria-label*="Close"]')
      if (closeButton) {
        await closeButton.click()
      }
    }
    
    console.log('\n🌍 STEP 4: TESTING LANGUAGE CHANGE...')
    const languageButton = await page.$('button[aria-label*="language"]')
    if (languageButton) {
      await languageButton.click()
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    console.log('\n🎨 STEP 5: TESTING THEME CHANGE...')
    const themeButton = await page.$('button[aria-label*="theme"]')
    if (themeButton) {
      await themeButton.click()
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    console.log('\n📊 STEP 6: CHECKING DATALAYER EVENTS...')
    const dataLayerEvents = await page.evaluate(() => {
      if (!window.dataLayer) return { error: 'No dataLayer' }
      
      const events = window.dataLayer.filter(item => 
        item && typeof item === 'object' && 
        (item.event || item[0] === 'event')
      )
      
      return {
        totalItems: window.dataLayer.length,
        eventItems: events.length,
        events: events.map(event => ({
          event: event.event || event[0],
          action: event.action || event[1],
          parameters: event[2] || event
        }))
      }
    })
    
    console.log('📊 DataLayer Events:', dataLayerEvents)
    
    console.log('\n🌐 STEP 7: CHECKING ANALYTICS REQUESTS...')
    const analyticsRequests = allRequests.filter(req => 
      req.url.includes('google') || req.url.includes('analytics') || req.url.includes('gtag')
    )
    
    console.log('📊 Analytics Requests:', analyticsRequests.length)
    analyticsRequests.forEach((req, index) => {
      console.log(`  ${index + 1}. ${req.method} ${req.url}`)
    })
    
    // Проверяем POST запросы
    const postRequests = analyticsRequests.filter(req => req.method === 'POST')
    console.log('\n📊 POST Requests:', postRequests.length)
    
    if (postRequests.length === 0) {
      console.log('❌ NO POST REQUESTS FOUND!')
      console.log('📊 This means events are not being sent to Google Analytics')
    } else {
      console.log('✅ POST requests found - events are being sent')
    }
    
    console.log('\n🔍 STEP 8: TESTING DIRECT GTAG CALL...')
    const directTest = await page.evaluate(() => {
      if (typeof window.gtag !== 'function') {
        return { error: 'gtag not available' }
      }
      
      try {
        console.log('📊 Making direct gtag call...')
        window.gtag('event', 'final_test', {
          event_category: 'Test',
          event_label: 'Final Test',
          value: 1
        })
        return { success: true }
      } catch (error) {
        return { error: error.message }
      }
    })
    
    console.log('📊 Direct Test Result:', directTest)
    
    console.log('\n📊 STEP 9: FINAL ANALYSIS...')
    const finalAnalysis = await page.evaluate(() => {
      if (!window.dataLayer) return { error: 'No dataLayer' }
      
      return {
        dataLayerLength: window.dataLayer.length,
        gtagFunction: typeof window.gtag,
        lastEvents: window.dataLayer.slice(-10)
      }
    })
    
    console.log('📊 Final Analysis:', finalAnalysis)
    
    console.log('\n🎯 COMPREHENSIVE RESULTS...')
    console.log('📊 Summary:')
    console.log(`  - Google Analytics Loaded: ${gaSetup.gtag === 'function' ? '✅' : '❌'}`)
    console.log(`  - DataLayer Active: ${gaSetup.dataLayer > 0 ? '✅' : '❌'}`)
    console.log(`  - Events in DataLayer: ${dataLayerEvents.eventItems || 0}`)
    console.log(`  - Analytics Requests: ${analyticsRequests.length}`)
    console.log(`  - POST Requests: ${postRequests.length}`)
    console.log(`  - QR Generated: ${qrGenerated ? '✅' : '❌'}`)
    
    if (gaSetup.gtag === 'function' && dataLayerEvents.eventItems > 0) {
      console.log('\n🎉 ANALYTICS IS WORKING!')
      console.log('📈 Events are being tracked and sent to Google Analytics')
      console.log('⏰ Check Google Analytics Realtime reports to see events')
    } else {
      console.log('\n❌ ANALYTICS ISSUES DETECTED')
      console.log('📊 Some events may not be working correctly')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    console.log('\n⏳ Browser will stay open for 10 seconds for manual inspection...')
    await new Promise(resolve => setTimeout(resolve, 10000))
    await browser.close()
  }
}

testAnalyticsFinal()
