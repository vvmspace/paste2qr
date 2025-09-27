import puppeteer from 'puppeteer';

async function testLocaleDebug() {
  console.log('🔍 Debugging Locale Configuration...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 375, height: 667 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Test main page
    console.log('📄 Testing main page...');
    await page.goto('http://localhost:3000');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check what locale is actually being used
    const localeInfo = await page.evaluate(() => {
      // Check HTML lang attribute
      const htmlLang = document.documentElement.getAttribute('lang');
      
      // Check if there are any locale indicators in the page
      const body = document.body.textContent;
      const hasSpanish = body.includes('Pegar') || body.includes('Código') || body.includes('Generador');
      const hasEnglish = body.includes('Paste') || body.includes('Code') || body.includes('Generator');
      
      // Check page title
      const title = document.title;
      
      // Check meta description
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      
      // Check if there are any locale-specific elements
      const localeElements = Array.from(document.querySelectorAll('[data-locale], [class*="locale"], [id*="locale"]'));
      
      return {
        htmlLang,
        title,
        metaDesc,
        hasSpanish,
        hasEnglish,
        localeElements: localeElements.length,
        bodyText: body.substring(0, 200)
      };
    });
    
    console.log('🔍 Locale Debug Info:');
    console.log(`   HTML lang: ${localeInfo.htmlLang}`);
    console.log(`   Title: ${localeInfo.title}`);
    console.log(`   Meta description: ${localeInfo.metaDesc}`);
    console.log(`   Has Spanish: ${localeInfo.hasSpanish}`);
    console.log(`   Has English: ${localeInfo.hasEnglish}`);
    console.log(`   Locale elements: ${localeInfo.localeElements}`);
    console.log(`   Body text: ${localeInfo.bodyText}...`);
    
    // Check if the page is actually using the correct locale
    if (localeInfo.htmlLang === 'es' && localeInfo.hasSpanish) {
      console.log('✅ SUCCESS: Page is in Spanish');
    } else if (localeInfo.htmlLang === 'en' && localeInfo.hasEnglish) {
      console.log('⚠️  WARNING: Page is in English, not Spanish');
    } else {
      console.log('❌ ERROR: Locale detection failed');
    }
    
    // Check if there are any console errors
    const consoleLogs = await page.evaluate(() => {
      return window.console.log.toString();
    });
    
    console.log('🔍 Console info available');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testLocaleDebug().catch(console.error);

