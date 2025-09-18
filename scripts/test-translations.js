#!/usr/bin/env node

import puppeteer from 'puppeteer'

const BASE_URL = 'http://localhost:3000'
const LOCALES = ['en', 'es', 'zh', 'fr', 'am', 'pt']

// Expected translations for each locale
const expectedTranslations = {
  en: {
    headerTitle: 'Paste to QR Code',
    heroTitle: 'Paste to QR Code',
    heroSubtitle: 'Paste any text from your clipboard and get a QR code instantly. No typing, no complexity - just paste and generate.',
    placeholder: 'Paste any text from your clipboard to generate QR code...',
    pasteButton: 'Paste',
    copyButton: 'Copy',
    shareButton: 'Share',
    downloadButton: 'Download',
    publishButton: 'Publish'
  },
  es: {
    headerTitle: 'Pegar a Código QR',
    heroTitle: 'Pegar a Código QR',
    heroSubtitle: 'Pega cualquier texto de tu portapapeles y obtén un código QR al instante. Sin escribir, sin complejidad - solo pega y genera.',
    placeholder: 'Pega cualquier texto de tu portapapeles para generar código QR...',
    pasteButton: 'Pegar',
    copyButton: 'Copiar',
    shareButton: 'Compartir',
    downloadButton: 'Descargar',
    publishButton: 'Publicar'
  },
  zh: {
    headerTitle: '粘贴到二维码',
    heroTitle: '粘贴到二维码',
    heroSubtitle: '从剪贴板粘贴任何文本，立即获得二维码。无需输入，无需复杂操作 - 只需粘贴和生成。',
    placeholder: '从剪贴板粘贴任何文本以生成二维码...',
    pasteButton: '粘贴',
    copyButton: '复制',
    shareButton: '分享',
    downloadButton: '下载',
    publishButton: '发布'
  },
  fr: {
    headerTitle: 'Coller vers Code QR',
    heroTitle: 'Coller vers Code QR',
    heroSubtitle: 'Collez n\'importe quel texte de votre presse-papiers et obtenez un code QR instantanément. Pas de frappe, pas de complexité - collez et générez.',
    placeholder: 'Collez n\'importe quel texte de votre presse-papiers pour générer un code QR...',
    pasteButton: 'Coller',
    copyButton: 'Copier',
    shareButton: 'Partager',
    downloadButton: 'Télécharger',
    publishButton: 'Publier'
  },
  am: {
    headerTitle: 'መለጠፍ ወደ QR ኮድ',
    heroTitle: 'መለጠፍ ወደ QR ኮድ',
    heroSubtitle: 'ከቅንጥብ ቦርድዎ ማንኛውንም ጽሑፍ ይለጥፉ እና ወዲያውኑ QR ኮድ ያግኙ። የመተየብ አስፈላጊነት የለም፣ ውስብስብነት የለም - ብቻ ይለጥፉ እና ይፍጠሩ።',
    placeholder: 'QR ኮድ ለመፍጠር ከቅንጥብ ቦርድዎ ማንኛውንም ጽሑፍ ይለጥፉ...',
    pasteButton: 'መለጠፍ',
    copyButton: 'መቅዳት',
    shareButton: 'መጋራት',
    downloadButton: 'መሸጋገር',
    publishButton: 'መተላለፍ'
  },
  pt: {
    headerTitle: 'Colar para Código QR',
    heroTitle: 'Colar para Código QR',
    heroSubtitle: 'Cole qualquer texto da sua área de transferência e obtenha um código QR instantaneamente. Sem digitação, sem complexidade - apenas cole e gere.',
    placeholder: 'Cole qualquer texto da sua área de transferência para gerar código QR...',
    pasteButton: 'Colar',
    copyButton: 'Copiar',
    shareButton: 'Compartilhar',
    downloadButton: 'Baixar',
    publishButton: 'Publicar'
  }
}

// Test results storage
const translationResults = {}

// Test translations for a specific locale
async function testTranslations(page, locale) {
  console.log(`\n🔍 Testing translations for ${locale}...`)
  
  const url = locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`
  await page.goto(url, { waitUntil: 'networkidle0' })
  
  // Wait for page to load and translations to be applied
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  }
  
  const expected = expectedTranslations[locale]
  
  try {
    // Test header title
    const headerTitle = await page.$eval('h1', el => el.textContent.trim())
    const headerTest = {
      key: 'headerTitle',
      expected: expected.headerTitle,
      actual: headerTitle,
      passed: headerTitle === expected.headerTitle
    }
    results.tests.push(headerTest)
    if (headerTest.passed) results.passed++
    else results.failed++
    
    // Test hero title
    const heroTitle = await page.$eval('h2', el => el.textContent.trim())
    const heroTest = {
      key: 'heroTitle',
      expected: expected.heroTitle,
      actual: heroTitle,
      passed: heroTitle === expected.heroTitle
    }
    results.tests.push(heroTest)
    if (heroTest.passed) results.passed++
    else results.failed++
    
    // Test hero subtitle
    const heroSubtitle = await page.$eval('p', el => el.textContent.trim())
    const subtitleTest = {
      key: 'heroSubtitle',
      expected: expected.heroSubtitle,
      actual: heroSubtitle,
      passed: heroSubtitle === expected.heroSubtitle
    }
    results.tests.push(subtitleTest)
    if (subtitleTest.passed) results.passed++
    else results.failed++
    
    // Test placeholder text
    const placeholder = await page.$eval('textarea', el => el.placeholder)
    const placeholderTest = {
      key: 'placeholder',
      expected: expected.placeholder,
      actual: placeholder,
      passed: placeholder === expected.placeholder
    }
    results.tests.push(placeholderTest)
    if (placeholderTest.passed) results.passed++
    else results.failed++
    
    // Test button texts
    const buttons = await page.$$eval('button', els => els.map(el => el.textContent.trim()))
    
    // Test paste button
    const pasteButton = buttons.find(btn => btn.includes('Paste') || btn.includes('Pegar') || btn.includes('粘贴') || btn.includes('Coller') || btn.includes('መለጠፍ') || btn.includes('Colar'))
    const pasteTest = {
      key: 'pasteButton',
      expected: expected.pasteButton,
      actual: pasteButton || 'Not found',
      passed: pasteButton === expected.pasteButton
    }
    results.tests.push(pasteTest)
    if (pasteTest.passed) results.passed++
    else results.failed++
    
    // Test language switcher
    const languageButton = await page.$eval('[data-testid="language-switcher"] button', el => el.textContent.trim())
    const languageTest = {
      key: 'languageButton',
      expected: 'Language',
      actual: languageButton,
      passed: languageButton === 'Language' || languageButton === 'Idioma' || languageButton === '语言' || languageButton === 'Langue' || languageButton === 'ቋንቋ' || languageButton === 'Idioma'
    }
    results.tests.push(languageTest)
    if (languageTest.passed) results.passed++
    else results.failed++
    
    console.log(`✅ Translation tests for ${locale}: ${results.passed}/${results.passed + results.failed} passed`)
    
    // Log failed tests
    results.tests.filter(test => !test.passed).forEach(test => {
      console.log(`❌ ${test.key}: Expected "${test.expected}", got "${test.actual}"`)
    })
    
    translationResults[locale] = results
    
  } catch (error) {
    console.error(`❌ Translation test failed for ${locale}:`, error.message)
    translationResults[locale] = { error: error.message }
  }
}

// Test language switching
async function testLanguageSwitching(page) {
  console.log(`\n🔄 Testing language switching...`)
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  }
  
  try {
    // Start on English page
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Get initial language
    const initialTitle = await page.$eval('h1', el => el.textContent.trim())
    const initialTest = {
      key: 'initialLanguage',
      expected: 'Paste to QR Code',
      actual: initialTitle,
      passed: initialTitle === 'Paste to QR Code'
    }
    results.tests.push(initialTest)
    if (initialTest.passed) results.passed++
    else results.failed++
    
    // Switch to Spanish
    await page.click('[data-testid="language-switcher"] button')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Click on Spanish option
    const spanishOption = await page.$('button:has-text("🇪🇸")')
    if (spanishOption) {
      await spanishOption.click()
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const spanishTitle = await page.$eval('h1', el => el.textContent.trim())
      const spanishTest = {
        key: 'spanishSwitch',
        expected: 'Pegar a Código QR',
        actual: spanishTitle,
        passed: spanishTitle === 'Pegar a Código QR'
      }
      results.tests.push(spanishTest)
      if (spanishTest.passed) results.passed++
      else results.failed++
    }
    
    // Switch to Chinese
    await page.click('[data-testid="language-switcher"] button')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const chineseOption = await page.$('button:has-text("🇨🇳")')
    if (chineseOption) {
      await chineseOption.click()
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const chineseTitle = await page.$eval('h1', el => el.textContent.trim())
      const chineseTest = {
        key: 'chineseSwitch',
        expected: '粘贴到二维码',
        actual: chineseTitle,
        passed: chineseTitle === '粘贴到二维码'
      }
      results.tests.push(chineseTest)
      if (chineseTest.passed) results.passed++
      else results.failed++
    }
    
    console.log(`✅ Language switching tests: ${results.passed}/${results.passed + results.failed} passed`)
    
    // Log failed tests
    results.tests.filter(test => !test.passed).forEach(test => {
      console.log(`❌ ${test.key}: Expected "${test.expected}", got "${test.actual}"`)
    })
    
    translationResults['languageSwitching'] = results
    
  } catch (error) {
    console.error(`❌ Language switching test failed:`, error.message)
    translationResults['languageSwitching'] = { error: error.message }
  }
}

// Main test function
async function runTranslationTests() {
  console.log('🚀 Starting translation tests...')
  
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
  
  // Run translation tests for each locale
  for (const locale of LOCALES) {
    await testTranslations(page, locale)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Test language switching
  await testLanguageSwitching(page)
  
  await browser.close()
  
  // Generate test report
  console.log('\n📊 TRANSLATION TEST RESULTS:')
  console.log('=' * 50)
  
  // Translation summary
  console.log('\n🔍 TRANSLATIONS:')
  Object.entries(translationResults).forEach(([locale, result]) => {
    if (result.error) {
      console.log(`❌ ${locale}: ${result.error}`)
    } else {
      console.log(`✅ ${locale}: ${result.passed}/${result.passed + result.failed} tests passed`)
    }
  })
  
  // Overall assessment
  const totalTests = Object.values(translationResults)
    .filter(r => !r.error)
    .reduce((sum, r) => sum + r.passed + r.failed, 0)
  
  const passedTests = Object.values(translationResults)
    .filter(r => !r.error)
    .reduce((sum, r) => sum + r.passed, 0)
  
  console.log(`\n🎯 OVERALL RESULT: ${passedTests}/${totalTests} translation tests passed`)
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TRANSLATION TESTS PASSED!')
  } else {
    console.log('⚠️  Some translation tests failed. Check the details above.')
  }
  
  // Recommendations
  console.log('\n💡 TRANSLATION RECOMMENDATIONS:')
  const failedLocales = Object.entries(translationResults)
    .filter(([locale, result]) => !result.error && result.failed > 0)
    .map(([locale]) => locale)
  
  if (failedLocales.length > 0) {
    console.log(`⚠️  Review translations for: ${failedLocales.join(', ')}`)
  } else {
    console.log('🎉 All translations are working correctly!')
  }
}

// Run tests
runTranslationTests().catch(console.error)