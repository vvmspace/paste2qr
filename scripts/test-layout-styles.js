import puppeteer from 'puppeteer'

async function testLayoutStyles() {
  let browser
  try {
    console.log('🎨 Testing Layout and Styles...')

    browser = await puppeteer.launch({
      headless: false, // Show browser for visual testing
      defaultViewport: { width: 375, height: 667 }, // iPhone SE size
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Test 1: Check CSS loading
    console.log('\n✅ Test 1: Check CSS Loading')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' })
    
    const cssLoaded = await page.evaluate(() => {
      const links = document.querySelectorAll('link[rel="stylesheet"]')
      return links.length > 0
    })
    console.log(`   CSS files loaded: ${cssLoaded ? '✓' : '❌'}`)
    
    // Test 2: Check Tailwind classes are applied
    console.log('\n✅ Test 2: Check Tailwind Classes')
    const tailwindClasses = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="bg-"], [class*="text-"], [class*="p-"], [class*="m-"]')
      return elements.length > 0
    })
    console.log(`   Tailwind classes present: ${tailwindClasses ? '✓' : '❌'}`)
    
    // Test 3: Check mobile layout
    console.log('\n✅ Test 3: Check Mobile Layout')
    const mobileLayout = await page.evaluate(() => {
      const header = document.querySelector('.sticky.top-0')
      const main = document.querySelector('main')
      const fixedBar = document.querySelector('.fixed.bottom-0')
      return header && main && fixedBar
    })
    console.log(`   Mobile layout elements: ${mobileLayout ? '✓' : '❌'}`)
    
    // Test 4: Check responsive design
    console.log('\n✅ Test 4: Check Responsive Design')
    await page.setViewport({ width: 768, height: 1024 }) // iPad size
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const responsiveLayout = await page.evaluate(() => {
      const container = document.querySelector('.max-w-4xl')
      return container !== null
    })
    console.log(`   Responsive container: ${responsiveLayout ? '✓' : '❌'}`)
    
    // Test 5: Check button styles
    console.log('\n✅ Test 5: Check Button Styles')
    const buttonStyles = await page.evaluate(() => {
      const button = document.querySelector('button')
      if (!button) return false
      
      const styles = window.getComputedStyle(button)
      return {
        hasBackground: styles.backgroundColor !== 'rgba(0, 0, 0, 0)',
        hasBorderRadius: styles.borderRadius !== '0px',
        hasPadding: styles.padding !== '0px',
        hasTransition: styles.transition !== 'all 0s ease 0s'
      }
    })
    console.log(`   Button background: ${buttonStyles?.hasBackground ? '✓' : '❌'}`)
    console.log(`   Button border radius: ${buttonStyles?.hasBorderRadius ? '✓' : '❌'}`)
    console.log(`   Button padding: ${buttonStyles?.hasPadding ? '✓' : '❌'}`)
    console.log(`   Button transitions: ${buttonStyles?.hasTransition ? '✓' : '❌'}`)
    
    // Test 6: Check form elements
    console.log('\n✅ Test 6: Check Form Elements')
    const formStyles = await page.evaluate(() => {
      const textarea = document.querySelector('textarea')
      if (!textarea) return false
      
      const styles = window.getComputedStyle(textarea)
      return {
        hasBorder: styles.border !== '0px none rgb(0, 0, 0)',
        hasBorderRadius: styles.borderRadius !== '0px',
        hasPadding: styles.padding !== '0px',
        hasFocus: textarea.matches(':focus')
      }
    })
    console.log(`   Textarea border: ${formStyles?.hasBorder ? '✓' : '❌'}`)
    console.log(`   Textarea border radius: ${formStyles?.hasBorderRadius ? '✓' : '❌'}`)
    console.log(`   Textarea padding: ${formStyles?.hasPadding ? '✓' : '❌'}`)
    
    // Test 7: Check color scheme
    console.log('\n✅ Test 7: Check Color Scheme')
    const colorScheme = await page.evaluate(() => {
      const body = document.body
      const header = document.querySelector('.bg-white')
      const button = document.querySelector('.bg-blue-600')
      
      return {
        bodyBg: body.style.backgroundColor || getComputedStyle(body).backgroundColor,
        headerBg: header ? getComputedStyle(header).backgroundColor : null,
        buttonBg: button ? getComputedStyle(button).backgroundColor : null
      }
    })
    console.log(`   Body background: ${colorScheme.bodyBg ? '✓' : '❌'}`)
    console.log(`   Header background: ${colorScheme.headerBg ? '✓' : '❌'}`)
    console.log(`   Button background: ${colorScheme.buttonBg ? '✓' : '❌'}`)
    
    // Test 8: Check typography
    console.log('\n✅ Test 8: Check Typography')
    const typography = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const h2 = document.querySelector('h2')
      const p = document.querySelector('p')
      
      return {
        h1FontWeight: h1 ? getComputedStyle(h1).fontWeight : null,
        h2FontWeight: h2 ? getComputedStyle(h2).fontWeight : null,
        pFontSize: p ? getComputedStyle(p).fontSize : null
      }
    })
    console.log(`   H1 font weight: ${typography.h1FontWeight ? '✓' : '❌'}`)
    console.log(`   H2 font weight: ${typography.h2FontWeight ? '✓' : '❌'}`)
    console.log(`   Paragraph font size: ${typography.pFontSize ? '✓' : '❌'}`)
    
    // Test 9: Check animations and transitions
    console.log('\n✅ Test 9: Check Animations')
    const animations = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="transition"], [class*="animate"]')
      return elements.length > 0
    })
    console.log(`   Animation classes: ${animations ? '✓' : '❌'}`)
    
    // Test 10: Check accessibility
    console.log('\n✅ Test 10: Check Accessibility')
    const accessibility = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button')
      const inputs = document.querySelectorAll('input, textarea')
      const hasAriaLabels = Array.from(buttons).some(btn => btn.getAttribute('aria-label'))
      const hasAltText = Array.from(document.querySelectorAll('img')).some(img => img.alt)
      
      return {
        buttonsHaveText: Array.from(buttons).every(btn => btn.textContent.trim() || btn.getAttribute('aria-label')),
        inputsHaveLabels: Array.from(inputs).every(input => input.getAttribute('aria-label') || input.placeholder),
        hasAriaLabels,
        hasAltText
      }
    })
    console.log(`   Buttons have text/labels: ${accessibility.buttonsHaveText ? '✓' : '❌'}`)
    console.log(`   Inputs have labels: ${accessibility.inputsHaveLabels ? '✓' : '❌'}`)
    console.log(`   Aria labels present: ${accessibility.hasAriaLabels ? '✓' : '❌'}`)
    
    console.log('\n🎉 All layout and style tests completed!')

  } catch (error) {
    console.error('❌ Layout test failed:', error)
    process.exit(1)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

testLayoutStyles()
