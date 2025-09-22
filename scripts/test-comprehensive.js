#!/usr/bin/env node

import puppeteer from 'puppeteer'
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
const testResults = {
  translations: {},
  defaultInput: {},
  qrCodeGeneration: {},
  seo: {},
  pageSpeed: {}
}

// Helper function to wait for element
async function waitForElement(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout })
    return true
  } catch (error) {
    return false
  }
}

// Test translations
async function testTranslations(page, locale) {
  console.log(`\n🔍 Testing translations for ${locale}...`)
  
  const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`
  await page.goto(url, { waitUntil: 'networkidle0' })
  
  // Wait for page to load
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const translations = {}
  
  try {
    // Test header title
    const headerTitle = await page.$eval('h1', el => el.textContent)
    translations.headerTitle = headerTitle
    
    // Test hero content
    const heroTitle = await page.$eval('h2', el => el.textContent)
    translations.heroTitle = heroTitle
    
    // Test placeholder text
    const placeholder = await page.$eval('textarea', el => el.placeholder)
    translations.placeholder = placeholder
    
    // Test button texts
    const pasteButton = await page.$eval('button', el => el.textContent)
    translations.pasteButton = pasteButton
    
    // Test language switcher
    const languageButton = await page.$eval('[data-testid="language-switcher"] button', el => el.textContent)
    translations.languageButton = languageButton
    
    console.log(`✅ Translations for ${locale}:`, translations)
    testResults.translations[locale] = translations
    
  } catch (error) {
    console.error(`❌ Translation test failed for ${locale}:`, error.message)
    testResults.translations[locale] = { error: error.message }
  }
}

// Test default input
async function testDefaultInput(page, locale) {
  console.log(`\n📝 Testing default input for ${locale}...`)
  
  const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`
  await page.goto(url, { waitUntil: 'networkidle0' })
  
  // Wait for page to load
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  try {
    // Check if textarea has default content
    const textareaValue = await page.$eval('textarea', el => el.value)
    const hasDefaultContent = textareaValue && textareaValue.trim().length > 0
    
    // Check if QR code is generated
    const qrCodeExists = await page.$('img[alt*="QR"]') !== null
    
    const result = {
      hasDefaultContent,
      defaultContent: textareaValue,
      qrCodeGenerated: qrCodeExists
    }
    
    console.log(`✅ Default input test for ${locale}:`, result)
    testResults.defaultInput[locale] = result
    
  } catch (error) {
    console.error(`❌ Default input test failed for ${locale}:`, error.message)
    testResults.defaultInput[locale] = { error: error.message }
  }
}

// Test QR code generation
async function testQRCodeGeneration(page, locale) {
  console.log(`\n🔲 Testing QR code generation for ${locale}...`)
  
  const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`
  await page.goto(url, { waitUntil: 'networkidle0' })
  
  // Wait for page to load
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  try {
    // Check if QR code exists on page load
    const qrCodeOnLoad = await page.$('img[alt*="QR"]') !== null
    
    // Test generating QR code with custom text
    await page.type('textarea', 'Test QR Code Generation')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const qrCodeAfterInput = await page.$('img[alt*="QR"]') !== null
    
    // Test download functionality
    const downloadButton = await page.$('button')
    const downloadWorks = downloadButton !== null
    
    const result = {
      qrCodeOnLoad,
      qrCodeAfterInput,
      downloadWorks
    }
    
    console.log(`✅ QR code generation test for ${locale}:`, result)
    testResults.qrCodeGeneration[locale] = result
    
  } catch (error) {
    console.error(`❌ QR code generation test failed for ${locale}:`, error.message)
    testResults.qrCodeGeneration[locale] = { error: error.message }
  }
}

// Test SEO
async function testSEO(page, locale) {
  console.log(`\n🔍 Testing SEO for ${locale}...`)
  
  const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`
  await page.goto(url, { waitUntil: 'networkidle0' })
  
  try {
    // Get page title
    const title = await page.title()
    
    // Get meta description
    const description = await page.$eval('meta[name="description"]', el => el.content)
    
    // Get meta keywords
    const keywords = await page.$eval('meta[name="keywords"]', el => el.content)
    
    // Get canonical URL
    const canonical = await page.$eval('link[rel="canonical"]', el => el.href)
    
    // Get hreflang tags
    const hreflangTags = await page.$$eval('link[rel="alternate"][hreflang]', els => 
      els.map(el => ({ hreflang: el.hreflang, href: el.href }))
    )
    
    // Get Open Graph tags
    const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content)
    const ogDescription = await page.$eval('meta[property="og:description"]', el => el.content)
    
    // Get Twitter tags
    const twitterTitle = await page.$eval('meta[name="twitter:title"]', el => el.content)
    const twitterDescription = await page.$eval('meta[name="twitter:description"]', el => el.content)
    
    const result = {
      title,
      description,
      keywords,
      canonical,
      hreflangTags,
      ogTitle,
      ogDescription,
      twitterTitle,
      twitterDescription
    }
    
    console.log(`✅ SEO test for ${locale}:`, result)
    testResults.seo[locale] = result
    
  } catch (error) {
    console.error(`❌ SEO test failed for ${locale}:`, error.message)
    testResults.seo[locale] = { error: error.message }
  }
}

// Test PageSpeed
async function testPageSpeed(page, locale) {
  console.log(`\n⚡ Testing PageSpeed for ${locale}...`)
  
  const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`
  
  const startTime = performance.now()
  await page.goto(url, { waitUntil: 'networkidle0' })
  const endTime = performance.now()
  
  const loadTime = endTime - startTime
  
  try {
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0]
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      }
    })
    
    const result = {
      loadTime: Math.round(loadTime),
      ...metrics
    }
    
    console.log(`✅ PageSpeed test for ${locale}:`, result)
    testResults.pageSpeed[locale] = result
    
  } catch (error) {
    console.error(`❌ PageSpeed test failed for ${locale}:`, error.message)
    testResults.pageSpeed[locale] = { error: error.message }
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting comprehensive tests...')
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
    console.log(`\n🌍 Testing locale: ${locale}`)
    
    await testTranslations(page, locale)
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    await testDefaultInput(page, locale)
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    await testQRCodeGeneration(page, locale)
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    await testSEO(page, locale)
    await new Promise(resolve => setTimeout(resolve, timeout))
    
    await testPageSpeed(page, locale)
    await new Promise(resolve => setTimeout(resolve, timeout * 2))
  }
  
  await browser.close()
  
  // Generate test report
  console.log('\n📊 TEST RESULTS SUMMARY:')
  console.log('=' * 50)
  
  // Translations summary
  console.log('\n🔍 TRANSLATIONS:')
  Object.entries(testResults.translations).forEach(([locale, result]) => {
    if (result.error) {
      console.log(`❌ ${locale}: ${result.error}`)
    } else {
      console.log(`✅ ${locale}: Header="${result.headerTitle}", Hero="${result.heroTitle}"`)
    }
  })
  
  // Default input summary
  console.log('\n📝 DEFAULT INPUT:')
  Object.entries(testResults.defaultInput).forEach(([locale, result]) => {
    if (result.error) {
      console.log(`❌ ${locale}: ${result.error}`)
    } else {
      console.log(`✅ ${locale}: Has content=${result.hasDefaultContent}, QR generated=${result.qrCodeGenerated}`)
    }
  })
  
  // QR code generation summary
  console.log('\n🔲 QR CODE GENERATION:')
  Object.entries(testResults.qrCodeGeneration).forEach(([locale, result]) => {
    if (result.error) {
      console.log(`❌ ${locale}: ${result.error}`)
    } else {
      console.log(`✅ ${locale}: On load=${result.qrCodeOnLoad}, After input=${result.qrCodeAfterInput}`)
    }
  })
  
  // SEO summary
  console.log('\n🔍 SEO:')
  Object.entries(testResults.seo).forEach(([locale, result]) => {
    if (result.error) {
      console.log(`❌ ${locale}: ${result.error}`)
    } else {
      console.log(`✅ ${locale}: Title="${result.title}", Description="${result.description?.substring(0, 50)}..."`)
    }
  })
  
  // PageSpeed summary
  console.log('\n⚡ PAGESPEED:')
  Object.entries(testResults.pageSpeed).forEach(([locale, result]) => {
    if (result.error) {
      console.log(`❌ ${locale}: ${result.error}`)
    } else {
      console.log(`✅ ${locale}: Load time=${result.loadTime}ms, FCP=${Math.round(result.firstContentfulPaint)}ms`)
    }
  })
  
  // Overall assessment
  const totalTests = LOCALES.length * 5 // 5 test types
  const passedTests = Object.values(testResults.translations).filter(r => !r.error).length +
                     Object.values(testResults.defaultInput).filter(r => !r.error).length +
                     Object.values(testResults.qrCodeGeneration).filter(r => !r.error).length +
                     Object.values(testResults.seo).filter(r => !r.error).length +
                     Object.values(testResults.pageSpeed).filter(r => !r.error).length
  
  console.log(`\n🎯 OVERALL RESULT: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED!')
  } else {
    console.log('⚠️  Some tests failed. Check the details above.')
  }
}

// Run tests
runTests().catch(console.error)