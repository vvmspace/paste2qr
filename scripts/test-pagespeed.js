#!/usr/bin/env node

import puppeteer from 'puppeteer'
import lighthouse from 'lighthouse'
import { performance } from 'perf_hooks'

const BASE_URL = 'http://localhost:3000'
const LOCALES = ['en', 'es', 'zh', 'fr', 'am', 'pt']

// Parse command line arguments for timeout
const getTimeout = () => {
  const timeoutArg = process.argv.find(arg => arg.startsWith('--timeout='))
  return timeoutArg ? parseInt(timeoutArg.split('=')[1]) : 100
}

const timeout = getTimeout()

// Test results storage
const pageSpeedResults = {}

// Run Lighthouse audit
async function runLighthouseAudit(page, url, locale) {
  console.log(`\n⚡ Running Lighthouse audit for ${locale}...`)
  
  try {
    const { lhr } = await lighthouse(url, {
      port: new URL(page.browser().wsEndpoint()).port,
      output: 'json',
      logLevel: 'info',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      settings: {
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        }
      }
    })
    
    const result = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      metrics: {
        firstContentfulPaint: Math.round(lhr.audits['first-contentful-paint'].numericValue),
        largestContentfulPaint: Math.round(lhr.audits['largest-contentful-paint'].numericValue),
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
        totalBlockingTime: Math.round(lhr.audits['total-blocking-time'].numericValue),
        speedIndex: Math.round(lhr.audits['speed-index'].numericValue)
      }
    }
    
    console.log(`✅ Lighthouse audit for ${locale}:`, result)
    return result
    
  } catch (error) {
    console.error(`❌ Lighthouse audit failed for ${locale}:`, error.message)
    return { error: error.message }
  }
}

// Test basic performance metrics
async function testBasicPerformance(page, locale) {
  console.log(`\n📊 Testing basic performance for ${locale}...`)
  
  const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`
  
  try {
    // Clear cache and cookies
    await page.goto('about:blank')
    await page.evaluate(() => {
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name))
        })
      }
    })
    
    // Measure page load time
    const startTime = performance.now()
    await page.goto(url, { waitUntil: 'networkidle0' })
    const endTime = performance.now()
    
    const loadTime = endTime - startTime
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0]
      const paintEntries = performance.getEntriesByType('paint')
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        resourceCount: performance.getEntriesByType('resource').length,
        totalSize: performance.getEntriesByType('resource').reduce((total, resource) => total + (resource.transferSize || 0), 0)
      }
    })
    
    const result = {
      loadTime: Math.round(loadTime),
      ...metrics
    }
    
    console.log(`✅ Basic performance for ${locale}:`, result)
    return result
    
  } catch (error) {
    console.error(`❌ Basic performance test failed for ${locale}:`, error.message)
    return { error: error.message }
  }
}

// Test QR code generation performance
async function testQRCodePerformance(page, locale) {
  console.log(`\n🔲 Testing QR code generation performance for ${locale}...`)
  
  const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`
  await page.goto(url, { waitUntil: 'networkidle0' })
  
  try {
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Test QR code generation time
    const startTime = performance.now()
    
    // Clear textarea and type new text
    await page.click('textarea')
    await page.keyboard.down('Control')
    await page.keyboard.press('KeyA')
    await page.keyboard.up('Control')
    await page.type('textarea', 'Performance test QR code generation')
    
    // Wait for QR code to generate
    await page.waitForSelector('img[alt]', { timeout: 5000 })
    
    const endTime = performance.now()
    const generationTime = endTime - startTime
    
    // Check if QR code is visible
    const qrCodeVisible = await page.$eval('img[alt]', el => {
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    })
    
    const result = {
      generationTime: Math.round(generationTime),
      qrCodeVisible,
      success: generationTime < 2000 && qrCodeVisible // Should generate in under 2 seconds
    }
    
    console.log(`✅ QR code performance for ${locale}:`, result)
    return result
    
  } catch (error) {
    console.error(`❌ QR code performance test failed for ${locale}:`, error.message)
    return { error: error.message }
  }
}

// Main test function
async function runPageSpeedTests() {
  console.log('🚀 Starting PageSpeed tests...')
  console.log(`⏱️  Timeout: ${timeout}ms between steps`)
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  // Enable console logging
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Browser Error:', msg.text())
    }
  })
  
  // Run tests for each locale
  for (const locale of LOCALES) {
    console.log(`\n🌍 Testing PageSpeed for locale: ${locale}`)
    
    const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`
    
    // Test basic performance
    const basicPerformance = await testBasicPerformance(page, locale)
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Test QR code performance
    const qrPerformance = await testQRCodePerformance(page, locale)
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    // Run Lighthouse audit (only for first locale to avoid long test times)
    let lighthouseResults = null
    if (locale === 'en') {
      lighthouseResults = await runLighthouseAudit(page, url, locale)
      await new Promise(resolve => setTimeout(resolve, timeout * 2))
    }
    
    pageSpeedResults[locale] = {
      basicPerformance,
      qrPerformance,
      lighthouse: lighthouseResults
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, timeout))
  }
  
  await browser.close()
  
  // Generate test report
  console.log('\n📊 PAGESPEED TEST RESULTS:')
  console.log('=' * 50)
  
  // Basic performance summary
  console.log('\n📊 BASIC PERFORMANCE:')
  Object.entries(pageSpeedResults).forEach(([locale, results]) => {
    if (results.basicPerformance.error) {
      console.log(`❌ ${locale}: ${results.basicPerformance.error}`)
    } else {
      const perf = results.basicPerformance
      console.log(`✅ ${locale}: Load=${perf.loadTime}ms, FCP=${Math.round(perf.firstContentfulPaint)}ms, Resources=${perf.resourceCount}`)
    }
  })
  
  // QR code performance summary
  console.log('\n🔲 QR CODE PERFORMANCE:')
  Object.entries(pageSpeedResults).forEach(([locale, results]) => {
    if (results.qrPerformance.error) {
      console.log(`❌ ${locale}: ${results.qrPerformance.error}`)
    } else {
      const qr = results.qrPerformance
      console.log(`✅ ${locale}: Generation=${qr.generationTime}ms, Success=${qr.success}`)
    }
  })
  
  // Lighthouse summary
  console.log('\n⚡ LIGHTHOUSE AUDIT:')
  Object.entries(pageSpeedResults).forEach(([locale, results]) => {
    if (results.lighthouse) {
      if (results.lighthouse.error) {
        console.log(`❌ ${locale}: ${results.lighthouse.error}`)
      } else {
        const lh = results.lighthouse
        console.log(`✅ ${locale}: Performance=${lh.performance}, SEO=${lh.seo}, Accessibility=${lh.accessibility}`)
        console.log(`   FCP=${lh.metrics.firstContentfulPaint}ms, LCP=${lh.metrics.largestContentfulPaint}ms`)
      }
    }
  })
  
  // Overall assessment
  const totalTests = LOCALES.length * 2 // Basic + QR performance
  const passedTests = Object.values(pageSpeedResults).filter(r => 
    !r.basicPerformance.error && !r.qrPerformance.error
  ).length
  
  console.log(`\n🎯 OVERALL RESULT: ${passedTests}/${totalTests} performance tests passed`)
  
  // Performance recommendations
  console.log('\n💡 PERFORMANCE RECOMMENDATIONS:')
  const avgLoadTime = Object.values(pageSpeedResults)
    .filter(r => !r.basicPerformance.error)
    .reduce((sum, r) => sum + r.basicPerformance.loadTime, 0) / LOCALES.length
  
  if (avgLoadTime > 3000) {
    console.log('⚠️  Average load time is high. Consider optimizing images and reducing bundle size.')
  } else if (avgLoadTime > 2000) {
    console.log('✅ Load time is acceptable but could be improved.')
  } else {
    console.log('🎉 Excellent load time performance!')
  }
  
  const avgQRTime = Object.values(pageSpeedResults)
    .filter(r => !r.qrPerformance.error)
    .reduce((sum, r) => sum + r.qrPerformance.generationTime, 0) / LOCALES.length
  
  if (avgQRTime > 1000) {
    console.log('⚠️  QR code generation is slow. Consider optimizing the QR generation algorithm.')
  } else {
    console.log('🎉 QR code generation is fast!')
  }
}

// Run tests
runPageSpeedTests().catch(console.error)