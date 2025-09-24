import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:3000'

async function testContentPerformance() {
  console.log('⚡ Testing Content Pages Performance...')
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  try {
    // Enable performance metrics
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = {
        navigationStart: performance.timing.navigationStart,
        loadComplete: 0,
        domContentLoaded: 0,
        firstPaint: 0,
        firstContentfulPaint: 0
      }
      
      // Track load events
      window.addEventListener('load', () => {
        window.performanceMetrics.loadComplete = performance.now()
      })
      
      window.addEventListener('DOMContentLoaded', () => {
        window.performanceMetrics.domContentLoaded = performance.now()
      })
    })
    
    const pages = [
      { path: '/qr-code-facts', name: 'QR Code Facts' },
      { path: '/qr-code-use-cases', name: 'QR Code Use Cases' },
      { path: '/es/qr-code-facts', name: 'QR Code Facts (ES)' },
      { path: '/zh/qr-code-use-cases', name: 'QR Code Use Cases (ZH)' }
    ]
    
    for (const pageInfo of pages) {
      console.log(`\n📄 Testing Performance: ${pageInfo.name}`)
      
      const startTime = Date.now()
      await page.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle0', timeout: 15000 })
      const navigationTime = Date.now() - startTime
      
      // Get performance metrics
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0]
        const paint = performance.getEntriesByType('paint')
        
        return {
          navigationStart: navigation.startTime,
          loadEventEnd: navigation.loadEventEnd,
          domContentLoaded: navigation.domContentLoadedEventEnd,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          totalTime: navigation.loadEventEnd - navigation.startTime
        }
      })
      
      console.log(`✅ Navigation Time: ${navigationTime}ms`)
      console.log(`✅ Total Load Time: ${metrics.totalTime.toFixed(2)}ms`)
      console.log(`✅ DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`)
      console.log(`✅ First Paint: ${metrics.firstPaint.toFixed(2)}ms`)
      console.log(`✅ First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`)
      
      // Test memory usage
      const memoryUsage = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
          }
        }
        return null
      })
      
      if (memoryUsage) {
        console.log(`✅ Memory Usage: ${memoryUsage.used}MB / ${memoryUsage.total}MB`)
      }
      
      // Test resource loading
      const resources = await page.evaluate(() => {
        const entries = performance.getEntriesByType('resource')
        return {
          total: entries.length,
          css: entries.filter(e => e.name.includes('.css')).length,
          js: entries.filter(e => e.name.includes('.js')).length,
          images: entries.filter(e => e.name.match(/\.(jpg|jpeg|png|gif|webp)$/)).length,
          fonts: entries.filter(e => e.name.match(/\.(woff|woff2|ttf|otf)$/)).length
        }
      })
      
      console.log(`✅ Resources: ${resources.total} total (${resources.css} CSS, ${resources.js} JS, ${resources.images} images, ${resources.fonts} fonts)`)
      
      // Test Core Web Vitals
      console.log('\n🎯 Testing Core Web Vitals...')
      
      // Simulate user interaction for LCP
      await page.evaluate(() => {
        // Scroll to trigger lazy loading
        window.scrollTo(0, document.body.scrollHeight)
        window.scrollTo(0, 0)
      })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Get LCP
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            resolve(lastEntry.startTime)
          })
          observer.observe({ entryTypes: ['largest-contentful-paint'] })
          
          // Fallback after 3 seconds
          setTimeout(() => resolve(0), 3000)
        })
      })
      
      console.log(`✅ Largest Contentful Paint: ${lcp.toFixed(2)}ms`)
      
      // Test CLS (Cumulative Layout Shift)
      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let clsValue = 0
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value
              }
            }
            resolve(clsValue)
          })
          observer.observe({ entryTypes: ['layout-shift'] })
          
          // Measure for 5 seconds
          setTimeout(() => resolve(clsValue), 5000)
        })
      })
      
      console.log(`✅ Cumulative Layout Shift: ${cls.toFixed(4)}`)
      
      // Test FID (First Input Delay) - simulate click
      const fid = await page.evaluate(() => {
        return new Promise((resolve) => {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            if (entries.length > 0) {
              resolve(entries[0].processingStart - entries[0].startTime)
            }
          })
          observer.observe({ entryTypes: ['first-input'] })
          
          // Simulate click after 1 second
          setTimeout(() => {
            document.body.click()
          }, 1000)
          
          // Fallback after 3 seconds
          setTimeout(() => resolve(0), 3000)
        })
      })
      
      console.log(`✅ First Input Delay: ${fid.toFixed(2)}ms`)
      
      // Performance score calculation
      const performanceScore = calculatePerformanceScore({
        fcp: metrics.firstContentfulPaint,
        lcp: lcp,
        cls: cls,
        fid: fid
      })
      
      console.log(`✅ Performance Score: ${performanceScore}/100`)
      
      // Test mobile performance
      console.log('\n📱 Testing Mobile Performance...')
      await page.setViewport({ width: 375, height: 667 })
      
      const mobileStartTime = Date.now()
      await page.reload({ waitUntil: 'networkidle0' })
      const mobileLoadTime = Date.now() - mobileStartTime
      
      console.log(`✅ Mobile Load Time: ${mobileLoadTime}ms`)
      
      // Reset viewport
      await page.setViewport({ width: 1200, height: 800 })
    }
    
    console.log('\n✅ All performance tests completed successfully!')
    
  } catch (error) {
    console.error('❌ Performance test failed:', error.message)
    throw error
  } finally {
    await browser.close()
  }
}

function calculatePerformanceScore({ fcp, lcp, cls, fid }) {
  let score = 100
  
  // FCP scoring (0-100)
  if (fcp > 3000) score -= 30
  else if (fcp > 1800) score -= 20
  else if (fcp > 1000) score -= 10
  
  // LCP scoring (0-100)
  if (lcp > 4000) score -= 30
  else if (lcp > 2500) score -= 20
  else if (lcp > 1200) score -= 10
  
  // CLS scoring (0-100)
  if (cls > 0.25) score -= 30
  else if (cls > 0.1) score -= 20
  else if (cls > 0.05) score -= 10
  
  // FID scoring (0-100)
  if (fid > 300) score -= 30
  else if (fid > 100) score -= 20
  else if (fid > 50) score -= 10
  
  return Math.max(0, score)
}

// Run the test
testContentPerformance().catch(console.error)

