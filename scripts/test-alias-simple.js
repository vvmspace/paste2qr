// Simple test for alias functionality using browser
import puppeteer from 'puppeteer'

async function testAliasSimple() {
  let browser
  try {
    console.log('🔄 Testing Alias Functionality in Browser...')

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: { width: 375, height: 667 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Test simple alias
    console.log('\n✅ Test 1: Simple Alias')
    await page.goto('http://localhost:3000/qr/hello-world', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea1 = await page.$('textarea')
    if (textarea1) {
      const textValue1 = await textarea1.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue1}"`)
      
      const hasText1 = textValue1.length > 0
      console.log(`   Has text content: ${hasText1 ? '✓' : '❌'}`)
    }
    
    // Test 2: Test URL alias
    console.log('\n✅ Test 2: URL Alias')
    await page.goto('http://localhost:3000/qr/https%3A%2F%2Fexample.com', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea2 = await page.$('textarea')
    if (textarea2) {
      const textValue2 = await textarea2.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue2}"`)
      
      const hasText2 = textValue2.length > 0
      console.log(`   Has text content: ${hasText2 ? '✓' : '❌'}`)
    }
    
    // Test 3: Test base64 alias
    console.log('\n✅ Test 3: Base64 Alias')
    await page.goto('http://localhost:3000/qr/b64_aGVsbG8gd29ybGQ%3D', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea3 = await page.$('textarea')
    if (textarea3) {
      const textValue3 = await textarea3.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue3}"`)
      
      const hasText3 = textValue3.length > 0
      console.log(`   Has text content: ${hasText3 ? '✓' : '❌'}`)
    }
    
    // Test 4: Test Cyrillic alias
    console.log('\n✅ Test 4: Cyrillic Alias')
    await page.goto('http://localhost:3000/qr/b64_0J_RgNC40LLQtdGCLCDQvNC40YA%3D%3D', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea4 = await page.$('textarea')
    if (textarea4) {
      const textValue4 = await textarea4.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue4}"`)
      
      const hasText4 = textValue4.length > 0
      console.log(`   Has text content: ${hasText4 ? '✓' : '❌'}`)
    }
    
    // Test 5: Test Chinese alias
    console.log('\n✅ Test 5: Chinese Alias')
    await page.goto('http://localhost:3000/qr/b64_5L2g5aW95LiW55WM', { waitUntil: 'networkidle0' })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const textarea5 = await page.$('textarea')
    if (textarea5) {
      const textValue5 = await textarea5.evaluate(el => el.value)
      console.log(`   Textarea value: "${textValue5}"`)
      
      const hasText5 = textValue5.length > 0
      console.log(`   Has text content: ${hasText5 ? '✓' : '❌'}`)
    }
    
    console.log('\n🎉 All alias tests completed!')

  } catch (error) {
    console.error('❌ Alias test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testAliasSimple()
